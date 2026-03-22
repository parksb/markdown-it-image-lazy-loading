import imageSize from 'image-size';
import path from 'node:path';

function lazy_loading_plugin(md, mdOptions) {
  var defaultImageRenderer = md.renderer.rules.image;
  var count = 0;

  var skipCount = mdOptions && mdOptions.skip_count !== undefined ? mdOptions.skip_count : 0;
  var excludeExtensions = mdOptions && mdOptions.exclude_extensions || [];
  var maxWidth = mdOptions && mdOptions.max_width !== undefined ? mdOptions.max_width : null;

  md.renderer.rules.image = function (tokens, idx, options, env, self) {
    var token = tokens[idx];
    if (count >= skipCount) {
      token.attrSet('loading', 'lazy');
    }

    if (mdOptions && mdOptions.decoding === true) {
      token.attrSet('decoding', 'async');
    }

    if (mdOptions && mdOptions.base_path && mdOptions.image_size === true) {
      const imgSrc = token.attrGet('src');

      const imgExt = path.extname(imgSrc);
      if (excludeExtensions.includes(imgExt)) {
        return defaultImageRenderer(tokens, idx, options, env, self);
      }

      const imgPath = path.join(mdOptions.base_path, imgSrc);
      const dimensions = imageSize(imgPath);

      if (maxWidth !== null && dimensions.width > maxWidth) {
        dimensions.height = Math.round(dimensions.height * (maxWidth / dimensions.width));
        dimensions.width = maxWidth;
      }

      token.attrSet('width', dimensions.width);
      token.attrSet('height', dimensions.height);
    }

    count += 1;

    return defaultImageRenderer(tokens, idx, options, env, self);
  };
};

export default lazy_loading_plugin;
