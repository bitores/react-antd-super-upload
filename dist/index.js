'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('antd/es/modal/style');
var _Modal = _interopDefault(require('antd/es/modal'));
require('antd/es/message/style');
var _message = _interopDefault(require('antd/es/message'));
require('antd/es/upload/style');
var _Upload = _interopDefault(require('antd/es/upload'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = _interopDefault(require('prop-types'));
var ReactCrop = _interopDefault(require('react-image-crop'));
require('react-image-crop/dist/ReactCrop.css');

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style$$1 = document.createElement('style');
  style$$1.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style$$1, head.firstChild);
    } else {
      head.appendChild(style$$1);
    }
  } else {
    head.appendChild(style$$1);
  }

  if (style$$1.styleSheet) {
    style$$1.styleSheet.cssText = css;
  } else {
    style$$1.appendChild(document.createTextNode(css));
  }
}

var css = ".index_antd-img-crop-modal__3sAnv .index_ant-modal__CRf6I .index_ant-modal-body__1YfSx {\n  display: flex;\n  justify-content: center;\n}\n.index_antd-img-crop-modal__3sAnv .index_ant-modal__CRf6I .index_ant-modal-body__1YfSx .index_ReactCrop__image__3h-nG {\n  width: 100%;\n  max-height: none;\n}\n";
styleInject(css);

var asyncToGenerator = function (fn) {
  return function () {
    var gen = fn.apply(this, arguments);
    return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }

      return step("next");
    });
  };
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

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

var Dragger = _Upload.Dragger;


function getBase64(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      return resolve(reader.result);
    };
    reader.onerror = function (error) {
      return reject(error);
    };
  });
}

// limit: 限制单次最多上传数量，nzMultiple 打开时有效；0 表示不限
// size: 限制文件大小，单位：KB；0 表示不限
// fileType: 限制文件类型，例如：image/png,image/jpeg,image/gif,image/bmp
// filter: 自定义过滤器
// showButton 是否展示上传按钮

var Uploader = function (_Component) {
  inherits(Uploader, _Component);

  function Uploader(props) {
    var _this2 = this,
        _this$filters;

    classCallCheck(this, Uploader);

    var _this = possibleConstructorReturn(this, (Uploader.__proto__ || Object.getPrototypeOf(Uploader)).call(this, props));

    _this.handleCancelPreview = function () {
      return _this.setState({ previewVisible: false });
    };

    _this.handlePreview = function () {
      var _ref = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(file) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!file.url && !file.preview)) {
                  _context.next = 4;
                  break;
                }

                _context.next = 3;
                return getBase64(file.originFileObj);

              case 3:
                file.preview = _context.sent;

              case 4:

                _this.setState({
                  previewImage: file.url || file.preview,
                  previewVisible: true
                });

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.onCropOk = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var cropData, x, y, width, height, canvas, ctx, _this$originalFile, name, type, uid;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              cropData = _this.state.cropData;
              x = cropData.x, y = cropData.y, width = cropData.width, height = cropData.height;

              if (!(!width || !height)) {
                _context3.next = 5;
                break;
              }

              _this.onClose();
              return _context3.abrupt('return');

            case 5:

              if (_this.scale !== undefined) {
                x = x * _this.scale;
                y = y * _this.scale;
                width = width * _this.scale;
                height = height * _this.scale;
              }

              // 获取裁切后的图片
              canvas = document.createElement('canvas');

              canvas.width = width;
              canvas.height = height;
              ctx = canvas.getContext('2d');

              ctx.drawImage(_this.imageRef, x, y, width, height, 0, 0, width, height);

              _this$originalFile = _this.originalFile, name = _this$originalFile.name, type = _this$originalFile.type, uid = _this$originalFile.uid;

              canvas.toBlob(function () {
                var _ref3 = asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(blob) {
                  var croppedFile, _this$props$beforeUpl, beforeUpload, response, croppedProcessedFile, fileType, useProcessedFile;

                  return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                      switch (_context2.prev = _context2.next) {
                        case 0:
                          // 生成新图片
                          croppedFile = new File([blob], name, { type: type, lastModified: Date.now() });

                          croppedFile.uid = uid;

                          // 关闭弹窗
                          _this.onCropClose();

                          _this$props$beforeUpl = _this.props.beforeUpload, beforeUpload = _this$props$beforeUpl === undefined ? function () {
                            return true;
                          } : _this$props$beforeUpl;
                          // 调用 beforeUpload

                          response = beforeUpload(croppedFile, [croppedFile]);

                          if (!(response === false)) {
                            _context2.next = 8;
                            break;
                          }

                          _this.reject();
                          return _context2.abrupt('return');

                        case 8:
                          if (!(typeof response.then !== 'function')) {
                            _context2.next = 11;
                            break;
                          }

                          _this.resolve(croppedFile);
                          return _context2.abrupt('return');

                        case 11:
                          _context2.prev = 11;
                          _context2.next = 14;
                          return response;

                        case 14:
                          croppedProcessedFile = _context2.sent;
                          fileType = Object.prototype.toString.call(croppedProcessedFile);
                          useProcessedFile = fileType === '[object File]' || fileType === '[object Blob]';


                          _this.resolve(useProcessedFile ? croppedProcessedFile : croppedFile);
                          _context2.next = 23;
                          break;

                        case 20:
                          _context2.prev = 20;
                          _context2.t0 = _context2['catch'](11);

                          _this.reject(_context2.t0);

                        case 23:
                        case 'end':
                          return _context2.stop();
                      }
                    }
                  }, _callee2, _this2, [[11, 20]]);
                }));

                return function (_x2) {
                  return _ref3.apply(this, arguments);
                };
              }(), type);

            case 13:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this2);
    }));

    _this.onCropClose = function () {
      _this.imageRef = undefined;
      _this.scale = undefined;

      _this.setState({
        cropModalVisible: false,
        cropData: {}
      });
    };

    _this.onCropChange = function (cropData) {
      _this.setState({ cropData: cropData });
    };

    _this.onCropImageLoaded = function (image) {
      if (_this.imageRef !== undefined) return;

      _this.imageRef = image;
      var _this$imageRef = _this.imageRef,
          naturalWidth = _this$imageRef.naturalWidth,
          naturalHeight = _this$imageRef.naturalHeight;

      var imgWidth = naturalWidth;
      var imgHeight = naturalHeight;

      var _this$props = _this.props,
          cropModalWidth = _this$props.cropModalWidth,
          cropWidth = _this$props.cropWidth,
          cropHeight = _this$props.cropHeight,
          useRatio = _this$props.useRatio;


      var modalBodyWidth = cropModalWidth - 24 * 2;
      if (naturalWidth > modalBodyWidth) {
        imgWidth = modalBodyWidth;
        _this.scale = naturalWidth / imgWidth;
        imgHeight = naturalHeight / _this.scale;
      }

      var aspect = cropWidth / cropHeight;
      var x = void 0;
      var y = void 0;
      var width = void 0;
      var height = void 0;

      if (useRatio === true) {
        var naturalAspect = naturalWidth / naturalHeight;
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

      _this.setState({ cropData: { unit: 'px', aspect: aspect, x: x, y: y, width: width, height: height } });
      return false;
    };

    _this.state = {
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
    };

    _this.uploadRef = React__default.createRef();

    _this.imageCount = 0;
    _this.filters = [];
    if (props.fileType) {
      _this.filters.push({
        name: 'type',
        fn: function fn(fileList) {
          if (props.fileType.length === 0) {
            return fileList;
          }
          var types = props.fileType.split(',');
          var filterFiles = fileList.filter(function (f) {
            return types.indexOf(f.type) > -1;
          });

          if (filterFiles.length !== fileList.length) {
            _message.error('文件格式不在 fileType 值中');
            return false;
          }

          return fileList;
        }
      });
    }

    if (props.size) {
      _this.filters.push({
        name: 'size',
        fn: function fn(fileList) {
          if (props.size === 0) {
            return fileList;
          }

          var filterFiles = fileList.filter(function (f) {
            return f.size <= props.size;
          });

          if (filterFiles.length !== fileList.length) {
            _message.error('文件超出限定 size 值');
            return false;
          }

          return fileList;
        }
      });
    }

    var _props$minWidth = props.minWidth,
        minWidth = _props$minWidth === undefined ? 0 : _props$minWidth,
        _props$minHeight = props.minHeight,
        minHeight = _props$minHeight === undefined ? 0 : _props$minHeight,
        _props$maxWidth = props.maxWidth,
        maxWidth = _props$maxWidth === undefined ? 0 : _props$maxWidth,
        _props$maxHeight = props.maxHeight,
        maxHeight = _props$maxHeight === undefined ? 0 : _props$maxHeight;

    if (maxWidth || maxHeight || minWidth || minHeight) {
      _this.filters.push({
        name: 'check width height',
        fn: function fn(fileList) {
          return new Promise(function (resolve, reject) {
            var filereader = new FileReader();
            filereader.onload = function (e) {
              var src = e.target.result;
              var image = new Image();
              image.onload = function () {
                var naturalWidth = this.naturalWidth,
                    naturalHeight = this.naturalHeight;


                if (maxWidth != 0 && naturalWidth > maxWidth || minWidth != 0 && naturalWidth < minWidth || maxHeight != 0 && naturalHeight > maxHeight || minHeight != 0 && naturalHeight < minHeight) {
                  _message.error('文件宽高超不符合要求');
                  reject();
                } else {
                  resolve();
                }
              };
              image.onerror = reject;
              image.src = src;
            };
            filereader.readAsDataURL(fileList[0]);
          });
        }
      });
    }

    (_this$filters = _this.filters).push.apply(_this$filters, toConsumableArray(props.filter || []));
    return _this;
  }

  //


  createClass(Uploader, [{
    key: 'render',
    value: function render() {
      var _this3 = this;

      var filters = this.filters;
      var _state = this.state,
          previewVisible = _state.previewVisible,
          previewImage = _state.previewImage,
          fileList = _state.fileList,
          _state$showButton = _state.showButton,
          showButton = _state$showButton === undefined ? true : _state$showButton,
          cropModalVisible = _state.cropModalVisible,
          cropImageSrc = _state.cropImageSrc,
          cropData = _state.cropData;
      var _props = this.props,
          children = _props.children,
          _props$max = _props.max,
          max = _props$max === undefined ? 0 : _props$max,
          filter = _props.filter,
          _onChange = _props.onChange,
          beforeUpload = _props.beforeUpload,
          onRemove = _props.onRemove,
          cropModalTitle = _props.cropModalTitle,
          cropModalWidth = _props.cropModalWidth,
          cropResize = _props.cropResize,
          cropResizeAndDrag = _props.cropResizeAndDrag,
          uploadProp = objectWithoutProperties(_props, ['children', 'max', 'filter', 'onChange', 'beforeUpload', 'onRemove', 'cropModalTitle', 'cropModalWidth', 'cropResize', 'cropResizeAndDrag']);


      return React__default.createElement(
        React.Fragment,
        null,
        React__default.createElement(
          _Upload,
          _extends({
            ref: this.uploadRef,
            fileList: fileList,
            onChange: function onChange(_ref4) {
              var fileList = _ref4.fileList;

              var needShowButton = true;
              if (max == 0 || fileList.length < max) {
                needShowButton = true;
              } else {
                needShowButton = false;
              }
              fileList.splice(max);
              _onChange && _onChange(fileList);
              _this3.setState({
                fileList: fileList,
                showButton: needShowButton
              });
            },
            beforeUpload: function beforeUpload(file, fileList) {
              return new Promise(function (resolve, reject) {

                _this3.resolve = resolve;
                _this3.reject = reject;

                _this3.imageCount++;
                var tasks = [];
                for (var i = 0, len = filters.length; i < len; i++) {
                  var f = filters[i];
                  var r = f.fn([file]);

                  if (r instanceof Promise) {
                    tasks.push(r);
                  } else if (!!r === false) {
                    tasks.push(Promise.reject());
                  } else {
                    tasks.push(Promise.resolve());
                  }
                }

                Promise.all(tasks).then(function () {
                  // 进行剪切控制
                  var _props$enCrop = _this3.props.enCrop,
                      enCrop = _props$enCrop === undefined ? false : _props$enCrop;

                  if (enCrop) {
                    _this3.originalFile = file;
                    // 读取添加的图片
                    var reader = new FileReader();
                    reader.addEventListener('load', function () {
                      _this3.setState({
                        cropModalVisible: true,
                        cropImageSrc: reader.result
                      });
                    });
                    reader.readAsDataURL(_this3.originalFile);
                  } else {
                    _this3.resolve();
                  }
                });
              });
            },
            onRemove: function onRemove(file) {
              _this3.imageCount--;
              _onChange && _onChange(_this3.state.fileList);
              return true;
            },
            onPreview: this.handlePreview
          }, uploadProp),
          showButton && children
        ),
        React__default.createElement(
          _Modal,
          {
            visible: cropModalVisible,
            width: cropModalWidth,
            onOk: this.onCropOk,
            onCancel: this.onCropClose,
            wrapClassName: 'antd-img-crop-modal',
            title: cropModalTitle || '编辑图片',
            maskClosable: false,
            destroyOnClose: true
          },
          cropImageSrc && React__default.createElement(ReactCrop, {
            src: cropImageSrc,
            crop: cropData,
            locked: cropResize === false,
            disabled: cropResizeAndDrag === false,
            onImageLoaded: this.onCropImageLoaded,
            onChange: this.onCropChange,
            keepSelection: true
          })
        ),
        React__default.createElement(
          _Modal,
          { visible: previewVisible, footer: null, onCancel: this.handleCancelPreview },
          React__default.createElement('img', { alt: '\u9884\u89C8\u56FE\u7247', style: { width: '100%' }, src: previewImage })
        )
      );
    }
  }]);
  return Uploader;
}(React.Component);


Uploader.propTypes = {
  //
  fileType: PropTypes.string,
  size: PropTypes.number,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  maxWidth: PropTypes.number,
  maxHeight: PropTypes.number,

  //crop
  cropWidth: PropTypes.number,
  cropHeight: PropTypes.number,
  useRatio: PropTypes.bool,
  cropResize: PropTypes.bool,
  cropResizeAndDrag: PropTypes.bool,

  cropModalTitle: PropTypes.string,
  cropModalWidth: PropTypes.number,
  beforeCrop: PropTypes.func,

  children: PropTypes.node
};

Uploader.defaultProps = {
  //
  fileType: '',
  size: 0,
  minWidth: 0,
  minHeight: 0,
  maxWidth: 0,
  maxHeight: 0,
  // crop
  cropWidth: 100,
  cropHeight: 100,
  useRatio: false,
  cropResize: true,
  cropResizeAndDrag: true,

  cropModalTitle: '图片裁剪',
  cropModalWidth: 520
};

module.exports = Uploader;
//# sourceMappingURL=index.js.map
