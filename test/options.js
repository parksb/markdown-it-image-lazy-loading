var test = require('tape');
var lazy_loading = require('../index.js');

test('skip_count: 1 skips first image', function (t) {
  t.plan(1);

  var md = require('markdown-it')();
  md.use(lazy_loading, { skip_count: 1 });

  t.equal(
    md.render(`![](a.png)\n\n![](b.png)`),
    '<p><img src="a.png" alt=""></p>\n' +
    '<p><img src="b.png" alt="" loading="lazy"></p>\n'
  );
});

test('skip_count: 2 skips first two images', function (t) {
  t.plan(1);

  var md = require('markdown-it')();
  md.use(lazy_loading, { skip_count: 2 });

  t.equal(
    md.render(`![](a.png)\n\n![](b.png)\n\n![](c.png)`),
    '<p><img src="a.png" alt=""></p>\n' +
    '<p><img src="b.png" alt=""></p>\n' +
    '<p><img src="c.png" alt="" loading="lazy"></p>\n'
  );
});

test('max_width limits image dimensions', function (t) {
  t.plan(1);

  var md = require('markdown-it')();
  md.use(lazy_loading, {
    image_size: true,
    base_path: __dirname,
    max_width: 100,
  });

  t.equal(
    md.render(`![](dummy-200x200.png "image title")`),
    '<p><img src="dummy-200x200.png" alt="" title="image title" loading="lazy" width="100" height="100"></p>\n'
  );
});

test('exclude_extensions skips specified extensions', function (t) {
  t.plan(1);

  var md = require('markdown-it')();
  md.use(lazy_loading, {
    image_size: true,
    base_path: __dirname,
    exclude_extensions: ['.png'],
  });

  t.equal(
    md.render(`![](dummy-200x200.png "image title")`),
    '<p><img src="dummy-200x200.png" alt="" title="image title" loading="lazy"></p>\n'
  );
});
