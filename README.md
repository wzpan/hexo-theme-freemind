Freemind
===

Yet another bootstrap based theme for Hexo.

* [Demo](http://hahack.tk/freemind/)
* [Q&A](http://hahack.tk/freemind/2014/03/16/qna/)
* [Tag Plugins](http://hahack.tk/freemind/2014/03/16/tag-plugins/)

## Features ##

* **Bootstrap** - get the power of Twitter Bootstrap with minimal hassle;
* **Tag plugins** - offers luxuriant Bootstrap tag plugins, including:
  - buttons - a button with target links, text and specified color;
  - labels - a label with text and specified color;
  - badges - a label with text and specified color;
  - alerts - alert messages with text and specified color; 
  - side notes - a note at the right side of the page;
  - side images - an image at the right side of the page.

## Install ##

1) install theme:

``` sh
$ git clone git@github.com:wzpan/freemind.git theme/freemind
```

2) install [hexo-tag-bootstrap](https://github.com/wzpan/hexo-tag-bootstrap):

``` sh
$ cd ..
$ npm install hexo-tag-bootstrap --save
```

3) modified your root `_config.yml` and change to freemind theme:

```
# Extensions
## Plugins: https://github.com/tommy351/hexo/wiki/Plugins
## Themes: https://github.com/tommy351/hexo/wiki/Themes
theme: freemind
```

4) Freemind offers you the customized Archives, Categories, Tags and About pages. It's recommended to download these pages and save them to your `source` folders:

``` sh
$ wget https://github.com/wzpan/freemind/archive/source.zip
$ unzip source.zip
$ cp -av freemind-source/* source/
$ rm -r freemind-source
```

That's all. Enjoy it!

## License ##

This theme is provided under [MIT](http://opensource.org/licenses/MIT).

## Credits ##

* The theme is based on [Twitter-Bootstrap 2.3.2](getbootstrap.com/2.3.2/);
* `Freemind` is named after [Pluskid's blog](http://freemind.pluskid.org/). This theme is greatly inspired by his blog layouts and stylesheets.
