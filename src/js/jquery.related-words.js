(function($){
    /**
     * 初期値
     */
    var defaults = {
        keyword : '',
        words   : [],
        limit   : 5
    };

    /**
     * リクエスト
     * @param   {String}   val
     * @param   {Function} callback
     * @return  this
     */
    var request = function(val, callback) {
        $.ajax({
            url     : 'http://www.google.com/complete/search',
            type    : 'GET',
            data    : {hl:'ja', client:'firefox', q: val},
            dataType: 'jsonp',
            success :function(data) {
                callback(data[1]);
            }
        });
    };

    /**
     * 関連ワード機能
     *
     * @class RelatedWords
     * @constructor
     * @param     {Element} elem
     * @param     {Object}  option
     */
    var RelatedWords = function(elem, option) {
        this.elem = $(elem);
        this.opt  = $.extend({}, defaults, option);
        if (typeof option.createList === 'function') this.create = option.createList;
        this.showList();
    };
    $.extend(RelatedWords.prototype, {
        /**
         * 要素： 関連ワード表示タグ（ul）
         * @type    {Element}
         */
        elem: null,

        /**
         * オプション
         * @type   {Object}
         */
        opt: { },

        /**
         * 関連ワードの一覧を生成する
         */
        createList: function(ul, words) {
            var n = 0,
                keyword = this.opt.keyword,
                limit   = this.opt.limit,
                url = '/search?';

            ul.html('');
            for (var i = 0; i < words.length; ++i) {
                if (keyword !== words[i]) {
                    ul.append(
                        $('<li>').addClass('link').append(
                            $('<a>')
                                .attr('href', url+'&q='+encodeURI(words[i]))
                                .text(words[i])
                        )
                    );
                    if (++n >= limit) break;
                }
            }
            if (n > 0) {
                ul.prepend($('<li>').addClass('title').text('関連ワード  > '));
            }
            return this;
        },

        /**
         * 関連ワードを表示する
         */
        showList  : function() {
            var ul = this.elem, words = this.opt.words;
            this.createList(ul, words);
            if ($('li', ul).length > 0) {
                this.elem.show();
            }
            return this;
        },

        /**
         * 関連ワードを非表示にする
         */
        hideList: function() {
            this.elem.hide();
            return this;
        }
    });

    $.fn.relatedWords = function(option) {
        var self = this;
        if (option.keyword) {
            request(option.keyword, function(data) {
                option.words = data;
                self.each(function() {
                    new RelatedWords(this, option);
                });
            });
        }
        return this;
    };
}(jQuery));
