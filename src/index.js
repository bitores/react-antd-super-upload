import React, { Component, Fragment } from 'react';
import { Upload, Modal, message } from 'antd';
import PropTypes from 'prop-types';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import './index.less'
try {
  new File([], '');
} catch (e) {
  // 兼容 IE new File()
  // import('canvas-toBlob').then(() => {
  //   /* eslint-disable-next-line */
  //   File = class File extends Blob {
  //     constructor(chunks, filename, opts = {}) {
  //       super(chunks, opts);
  //       this.lastModifiedDate = new Date();
  //       this.lastModified = +this.lastModifiedDate;
  //       this.name = filename;
  //     }
  //   };
  // });
}

const { Dragger } = Upload;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function start(tasks) {
  var result = []
  return tasks.reduce((accumulator, item, index) => {
    return accumulator.then(res => {
      return item.then(res => {
        result[index] = res
        return index == tasks.length - 1 ? result : item
      })
    })
  }, Promise.resolve())
}

// limit: 限制单次最多上传数量，nzMultiple 打开时有效；0 表示不限
// size: 限制文件大小，单位：KB；0 表示不限
// fileType: 限制文件类型，例如：image/png,image/jpeg,image/gif,image/bmp
// filter: 自定义过滤器
// showButton 是否展示上传按钮

export default class Uploader extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // 预览
      previewVisible: false,
      previewImage: '',
      // 正常数据
      fileList: props.value || [],
      showButton: true,
      //
      cropModalVisible: false,
      cropImageSrc: null,
      cropData: {}
    }

    this.uploadRef = React.createRef();

    this.imageCount = 0;
    this.filters = [];
    if (props.fileType) {
      this.filters.push({
        name: 'type',
        fn: fileList => {
          if (props.fileType.length === 0) {
            return fileList;
          }
          let types = props.fileType.split(',');
          let filterFiles = fileList.filter(f => types.indexOf(f.type) > -1);

          if (filterFiles.length !== fileList.length) {
            message.error('文件格式不在 fileType 值中')
            return false;
          }

          return fileList;
        }
      })
    }

    if (props.size) {
      this.filters.push({
        name: 'size',
        fn: fileList => {
          if (props.size === 0) {
            return fileList;
          }

          let filterFiles = fileList.filter(f => f.size <= props.size);

          if (filterFiles.length !== fileList.length) {
            message.error('文件超出限定 size 值')
            return false;
          }

          return fileList;
        }
      })
    }

    const { minWidth = 0, minHeight = 0, maxWidth = 0, maxHeight = 0 } = props;
    if (maxWidth || maxHeight || minWidth || minHeight) {
      this.filters.push({
        name: 'check width height',
        fn: (fileList) => {
          return new Promise((resolve, reject) => {
            let filereader = new FileReader();
            filereader.onload = e => {
              let src = e.target.result;
              const image = new Image();
              image.onload = function () {
                const { naturalWidth, naturalHeight } = this;

                if ((maxWidth != 0 && naturalWidth > maxWidth)
                  || (minWidth != 0 && naturalWidth < minWidth)
                  || (maxHeight != 0 && naturalHeight > maxHeight)
                  || (minHeight != 0 && naturalHeight < minHeight)) {
                  message.error('文件宽高超不符合要求')
                  reject()
                } else {
                  resolve();
                }
              };
              image.onerror = reject;
              image.src = src;
            };
            filereader.readAsDataURL(fileList[0]);
          })
        }
      })
    }

    this.filters.push(...(props.filter || []))
  }

  handleCancelPreview = () => this.setState({ previewVisible: false });
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  //
  onCropOk = async () => {
    const { cropData } = this.state;
    let { x, y, width, height } = cropData;

    if (!width || !height) {
      this.onClose();
      return;
    }

    if (this.scale !== undefined) {
      x = x * this.scale;
      y = y * this.scale;
      width = width * this.scale;
      height = height * this.scale;
    }

    // 获取裁切后的图片
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.imageRef, x, y, width, height, 0, 0, width, height);

    const { name, type, uid } = this.originalFile;
    canvas.toBlob(async (blob) => {
      // 生成新图片
      const croppedFile = new File([blob], name, { type, lastModified: Date.now() });
      croppedFile.uid = uid;

      // 关闭弹窗
      this.onCropClose();

      const { beforeUpload = () => true } = this.props;
      // 调用 beforeUpload
      const response = beforeUpload(croppedFile, [croppedFile]);

      if (response === false) {
        this.reject();
        return;
      }

      if (typeof response.then !== 'function') {
        this.resolve(croppedFile);
        return;
      }

      try {
        const croppedProcessedFile = await response;
        const fileType = Object.prototype.toString.call(croppedProcessedFile);
        const useProcessedFile = fileType === '[object File]' || fileType === '[object Blob]';

        this.resolve(useProcessedFile ? croppedProcessedFile : croppedFile);
      } catch (err) {
        this.reject(err);
      }
    }, type);
  }

  onCropClose = () => {
    this.imageRef = undefined;
    this.scale = undefined;

    this.setState({
      cropModalVisible: false,
      cropData: {}
    })
  }

  onCropChange = (cropData) => {
    this.setState({ cropData })
  }

  onCropImageLoaded = (image) => {
    if (this.imageRef !== undefined) return;

    this.imageRef = image;
    const { naturalWidth, naturalHeight } = this.imageRef;
    let imgWidth = naturalWidth;
    let imgHeight = naturalHeight;

    const { cropModalWidth, cropWidth, cropHeight, useRatio } = this.props;

    const modalBodyWidth = cropModalWidth - 24 * 2;
    if (naturalWidth > modalBodyWidth) {
      imgWidth = modalBodyWidth;
      this.scale = naturalWidth / imgWidth;
      imgHeight = naturalHeight / this.scale;
    }

    const aspect = cropWidth / cropHeight;
    let x;
    let y;
    let width;
    let height;

    if (useRatio === true) {
      const naturalAspect = naturalWidth / naturalHeight;
      if (naturalAspect > aspect) {
        y = 0;
        height = imgHeight;
        width = height * aspect;
        x = (imgWidth - width) / 2;
      } else {
        x = 0;
        width = imgWidth;
        height = width / aspect;
        y = (imgHeight - height) / 2;
      }
    } else {
      x = (imgWidth - cropWidth) / 2;
      y = (imgHeight - cropHeight) / 2;
      width = cropWidth;
      height = cropHeight;
    }

    this.setState({ cropData: { unit: 'px', aspect, x, y, width, height } });
    return false;
  }

  render() {
    const { filters } = this;
    const {
      previewVisible,
      previewImage,
      //
      fileList,
      showButton = true,
      //
      cropModalVisible, cropImageSrc, cropData
    } = this.state;
    const {
      children,
      max = 0,
      filter,
      onChange,
      beforeUpload,
      onRemove,
      // crop
      cropModalTitle, cropModalWidth, cropResize, cropResizeAndDrag,
      ...uploadProp
    } = this.props;

    return <Fragment>
      <Upload
        ref={this.uploadRef}
        fileList={fileList}
        onChange={({ fileList }) => {
          let needShowButton = true;
          if (max == 0 || fileList.length < max) {
            needShowButton = true;
          } else {
            needShowButton = false;
          }
          fileList.splice(max);
          onChange && onChange(fileList)
          this.setState({
            fileList: fileList,
            showButton: needShowButton
          })
        }}
        beforeUpload={(file, fileList) => {
          return new Promise((resolve, reject) => {

            this.resolve = resolve;
            this.reject = reject;

            this.imageCount++;
            let tasks = [];
            for (let i = 0, len = filters.length; i < len; i++) {
              let f = filters[i];
              let r = f.fn([file]);

              if (r instanceof Promise) {
                tasks.push(r);
              } else if (!!r === false) {
                tasks.push(Promise.reject())
              } else {
                tasks.push(Promise.resolve())
              }
            }

            Promise.all(tasks).then(() => {
              // 进行剪切控制
              const { enCrop = false } = this.props;
              if (enCrop) {
                this.originalFile = file;
                // 读取添加的图片
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  this.setState({
                    cropModalVisible: true,
                    cropImageSrc: reader.result,
                  });
                });
                reader.readAsDataURL(this.originalFile);
              } else {
                this.resolve()
              }
            })


          })

        }}
        onRemove={(file) => {
          this.imageCount--;
          onChange && onChange(this.state.fileList)
          return true;
        }}
        onPreview={this.handlePreview}
        {...uploadProp}
      >
        {showButton && children}
      </Upload>
      <Modal
        visible={cropModalVisible}
        width={cropModalWidth}
        onOk={this.onCropOk}
        onCancel={this.onCropClose}
        wrapClassName="antd-img-crop-modal"
        title={cropModalTitle || '编辑图片'}
        maskClosable={false}
        destroyOnClose
      >
        {cropImageSrc && (
          <ReactCrop
            src={cropImageSrc}
            crop={cropData}
            locked={cropResize === false}
            disabled={cropResizeAndDrag === false}
            onImageLoaded={this.onCropImageLoaded}
            onChange={this.onCropChange}
            keepSelection
          />
        )}
      </Modal>
      <Modal visible={previewVisible} footer={null} onCancel={this.handleCancelPreview}>
        <img alt="预览图片" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Fragment>
  }
}


Uploader.propTypes = {
  //
  fileType: PropTypes.string,
  size: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,
  enCrop: PropTypes.bool,
  filter: PropTypes.array,

  //crop
  cropWidth: PropTypes.number,
  cropHeight: PropTypes.number,
  useRatio: PropTypes.bool,
  cropResize: PropTypes.bool,
  cropResizeAndDrag: PropTypes.bool,

  cropModalTitle: PropTypes.string,
  cropModalWidth: PropTypes.number,
  beforeCrop: PropTypes.func,

  children: PropTypes.node,
};

Uploader.defaultProps = {
  //
  fileType: '',
  size: 0,
  minWidth: 0,
  minHeight: 0,
  maxWidth: 0,
  maxHeight: 0,
  enCrop: false,
  filter: [],
  // crop
  cropWidth: 100,
  cropHeight: 100,
  useRatio: false,
  cropResize: true,
  cropResizeAndDrag: true,

  cropModalTitle: '图片裁剪',
  cropModalWidth: 520,
};