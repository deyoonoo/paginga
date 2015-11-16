/*!
 * paginga - jQuery Pagination Plugin v0.2
 * https://github.com/mrk-j/paginga
 *
 * Copyright 2015 Mark and other contributors
 * Released under the MIT license
 * https://github.com/mrk-j/paginga/blob/master/LICENSE
 */
;(function ($, window, document, undefined)
{
	"use strict";

		var pluginName = "paginga",
			defaults = {
				itemsPerPage: 3,
				itemsContainer: ".items",
				item: "div",
				page: 1,
				nextPage: ".nextPage",
				previousPage: ".previousPage", 
				firstPage: ".firstPage",
				lastPage: ".lastPage",
				pageNumbers: ".pageNumbers",
				currentPageClass: "active",
				pager: ".pager",
				autoHidePager: true,
			};

		// The actual plugin constructor
		function paginga(element, options)
		{
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;
			this.currentPage = this.settings.page;
			this.items = $(this.element).find(".items " + this.settings.item);
			this.totalPages = Math.ceil(this.items.size() / this.settings.itemsPerPage);

			if(this.totalPages <= 1)
			{
				$(this.element).find(this.settings.pager).hide();
			}
			else
			{
				this.init();
			}
		}

		$.extend(paginga.prototype,
		{
			init: function()
			{
				this.bindEvents();
				this.showPage();
			},
			bindEvents: function()
			{
				var plugin = this,
					element = $(plugin.element),
					previousElement = element.find(plugin.settings.previousPage),
					nextElement = element.find(plugin.settings.nextPage),
					firstElement = element.find(plugin.settings.firstPage),
					lastElement = element.find(plugin.settings.lastPage);

				previousElement.on("click", function()
				{
					plugin.showPreviousPage.call(plugin);
				});

				nextElement.on("click", function()
				{
					plugin.showNextPage.call(plugin);
				});

				firstElement.on("click", function()
				{
					plugin.showFirstPage.call(plugin);
				});

				lastElement.on("click", function()
				{
					plugin.showLastPage.call(plugin);
				});
			},
			showPreviousPage: function()
			{
				this.currentPage--;

				if(this.currentPage <= 1)
				{
					this.currentPage = 1;
				}

				this.showPage();
			},
			showNextPage: function()
			{
				this.currentPage++;

				if(this.currentPage >= this.totalPages)
				{
					this.currentPage = this.totalPages;
				}

				this.showPage();
			},
			showFirstPage: function()
			{
				this.currentPage = 1;

				this.showPage();
			},
			showLastPage: function()
			{
				this.currentPage = this.totalPages;

				this.showPage();
			},
			showPage: function()
			{
				var firstItem = (this.currentPage * this.settings.itemsPerPage) - this.settings.itemsPerPage,
					lastItem = firstItem + this.settings.itemsPerPage;

				$.each(this.items, function(index, item)
				{
					if(index >= firstItem && index < lastItem)
					{
						$(item).show();

						return true;
					}

					$(item).hide();
				});

				var plugin = this,
					element = $(plugin.element),
					previousElement = element.find(plugin.settings.previousPage),
					nextElement = element.find(plugin.settings.nextPage),
					firstElement = element.find(plugin.settings.firstPage),
					lastElement = element.find(plugin.settings.lastPage);

				if(this.currentPage <= 1)
				{
					previousElement.addClass("disabled");
					firstElement.addClass("disabled");
				}
				else
				{
					previousElement.removeClass("disabled");
					firstElement.removeClass("disabled");
				}

				if(this.currentPage >= this.totalPages)
				{
					nextElement.addClass("disabled");
					lastElement.addClass("disabled");
				}
				else
				{
					nextElement.removeClass("disabled");
					lastElement.removeClass("disabled");
				}

				var pager = element.find(this.settings.pager),
					pageNumbers = pager.find(this.settings.pageNumbers);

				if(pageNumbers)
				{
					pageNumbers.html("");

					for(var pageNumber = 1; pageNumber <= this.totalPages; pageNumber++)
					{
						var className = pageNumber == this.currentPage ? this.settings.currentPageClass : "";

						pageNumbers.append("<a href='#' data-page='" + pageNumber + "' class='" + className + "'>" + pageNumber + "</a>");
					}

					pageNumbers.find("a").on("click", function()
					{
						plugin.currentPage = $(this).data("page");

						plugin.showPage.call(plugin);
					});
				}
			}
		});

		$.fn[pluginName] = function(options)
		{
			return this.each(function()
			{
				if(!$.data(this, "plugin_" + pluginName))
				{
					$.data(this, "plugin_" + pluginName, new paginga(this, options));
				}
			});
		};

})(jQuery, window, document);
