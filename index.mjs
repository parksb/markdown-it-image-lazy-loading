import imageSize from 'image-size';
import path from 'node:path';

function lazy_loading_plugin(md, mdOptions) {
  var defaultImageRenderer = md.renderer.rules.image;
  var count = 0;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    if (count > 0) {
      token.attrSet('loading', 'lazy');
    }

    if (mdOptions && mdOptions.decoding === true) {
      token.attrSet('decoding', 'async');
    }

    if (mdOptions && mdOptions.base_path && mdOptions.image_size === true) {
      const imgSrc = token.attrGet('src');

      const imgExt = path.extname(imgSrc);
      if (imgExt === '.mp4') {
        return defaultImageRenderer(tokens, idx, options, env, self);
      }

      const imgPath = path.join(mdOptions.base_path, imgSrc);
      const dimensions = imageSize(imgPath);

      if (dimensions.width > 800) {
        dimensions.height = Math.round(dimensions.height * (800 / dimensions.width));
        dimensions.width = 800;
      }

      token.attrSet('width', dimensions.width);
      token.attrSet('height', dimensions.height);
    }

    count += 1;

    return defaultImageRenderer(tokens, idx, options, env, self);
  };
};

export default lazy_loading_plugin;
