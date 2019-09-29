# react-antd-super-upload




|          属性 | 类型       | 默认       | 描述   |
| ----------------: | ---------- | ---------- | ------------- |
|         cropWidth | `number`   | `100`      | Crop width in `px`. If `useRatio` is `true`, it'll be ratio. |
|        cropHeight | `number`   | `100`      | Crop height in `px`. If `useRatio` is `true`, it'll be ratio. |
|          useRatio | `boolean`  | `false`    | If use `width` and `height` as ratio, not real `px`. And crop will fill the width or height. e.g. `width={500} height={400}` and `width={5} height={4}` are exactly the same. |
|        cropResize | `boolean`  | `true`     | If crop can resize.                                          |
| cropResizeAndDrag | `boolean`  | `true`     | If crop can resize and drag.                                 |
|    cropModalTitle | `string`   | `图片裁剪` | Modal title.                                                 |
|    cropModalWidth | `number`   | `520`      | Modal width in `px`.                                         |
|        beforeCrop | `function` | -          | Execute before crop, if return `false`, modal will not open (Not support `Promise`). Ant Design Upload `beforeUpload` prop will execute after crop, before upload. |
|         fileType | `string`   | `""`      | 接受上传的文件类型, 详见 input accept Attribute , 值为空时不限 |
|         size | `number`   | `0`      | 单个文件大小 , 值为0时不限|
|         minWidth | `number`   | `0`      | 单个文件最小宽度 , 值为0时不限 |
|         minHeight | `number`   | `0`      | 单个文件最小高度 , 值为0时不限 |
|         maxWidth | `number`   | `0`      | 单个文件最大宽度 , 值为0时不限 |
|         maxHeight | `number`   | `0`      | 单个文件最大高度 , 值为0时不限 |
|         enCrop | `boolean`   | `false`      | 图片上传时开启裁剪 |
|         filter | `array`   | `[]`      | 值类似 `{name: 'xx', fn: Function}` |
|         max | `number`   | `0`      | 图片个数限制 |
|         其它 |    |       | 其它属性同 `antd upload` |