Freemind
===

Yet another [bootstrap](http://getbootstrap.com) based theme for [Hexo](http://zespia.tw/hexo/). Freemind aims at fully taking advantages of Bootstrap.

* [Demo](http://hahack.tk/freemind/)
* [Q&A](http://hahack.tk/freemind/2014/03/16/qna/)
* [Tag Plugins](http://hahack.tk/freemind/2014/03/16/tag-plugins/)

## Features ##

* **Bootstrap** - get the power of Twitter Bootstrap with minimal hassle;
* **Tag plugins** - luxuriant Bootstrap tag plugins, provided by [hexo-tag-bootstrap](https://github.com/wzpan/hexo-tag-bootstrap), including:
  - textcolor - a paragraph of text with specified color;
  - button - a button with target links, text and specified color;
  - label - a label with text and specified color;
  - badge - a badge with text;
  - alert - alert messages with text and specified color; 

## Install ##

1) install theme:

``` sh
$ git clone git@github.com:wzpan/freemind.git theme/freemind
```

2) install [hexo-tag-bootstrap](https://github.com/wzpan/hexo-tag-bootstrap):

``` sh
$ npm install hexo-tag-bootstrap --save
```

3) Create pages

Freemind offers you the customized Categories, Tags and About pages. But you need to manually create these page at your 'source' folder.

For example, to create a `Categories` page, you may create a `index.html` file at `source/categories/` folder with the following contents:

```
title: Categories
layout: categories
---
```

Tags and About pages are created in a similar way, except that the layouts are `tags` and `page` respectively.

> Some people may argue that I should embed these pages in the theme. This really makes sense, but currently I don't have time to do so. If you know how, **welcome to send me patches**.

## Enable ##

Modify `theme` setting in your `_config.yml` to `freemind`.

## Update ##

``` sh
$ cd themes/landscape
$ git pull
```

## Configuration ##

```
slogan: Yet another bootstrap theme.

menu:
  - title: Archives
    url: archives
    intro: All the articles.
    icon: fa fa-archive
  - title: Categories
    url: categories
    intro: All the categories.
    icon: fa fa-folder
  - title: Tags
    url: tags
    intro: All the tags.
    icon: fa fa-tags
  - title: About
    url: about
    intro: About me.
    icon: fa fa-user

links:
  - title: My Github
    url: http://www.github.com/wzpan
    intro: My Github account.
    icon: fa fa-github
  - title: My LinkedIn
    url: http://www.linkedin.com/pub/weizhou-pan/5b/8a0/161
    intro: My Linkin account.
    icon: fa fa-linkedin

widgets:
- search
- category
- tagcloud
- recent_posts
- links

rss: /atom.xml
favicon: favicon.png
fancybox: true
google_analytics: UA-49061001-1
```

* **slogan** - slogan display at the index page
* **menu** - Navigation menu
* **links** - reference links at the links widget
* **widgets** - Widgets displaying in sidebar
* **rss** - RSS link
* **fancybox** - Enable [Fancybox](http://fancyapps.com/fancybox/)
* **google_analytics** - Google Analytics ID

## License ##

This theme is provided under [MIT](http://opensource.org/licenses/MIT).

## Credits ##

* The theme is based on [Twitter-Bootstrap 3.1.1](getbootstrap.com/3.1.1/);
* `Freemind` is named after [Pluskid's blog](http://freemind.pluskid.org/). This theme is greatly inspired by his blog layouts and stylesheets.
