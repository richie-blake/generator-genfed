(function(document, window) {

    "use strict";

    var Site = function() {

        // Require any modules here


        // Document ready
        var self = this;
        if ("addEventListener" in window) {

            document.onreadystatechange = function() {
                if (document.readyState === "complete") {
                    self.init.call(self);
                }
            };

        } else {

            window.onload = function() {
                self.init.call(self);
            };

        }

    };

    Site.prototype = {

        init: function() {

            // Add any module initialisation code here

        }

    };

    return new Site();

})(document, window);