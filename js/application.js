$(document).ready(function() {
	// For Webapp NO full screen
	if (!window.navigator.standalone) {
		if (window.navigator.userAgent.match(/like Mac OS X/i)) {
			$('body').addClass('mobile');
		}
		else {
			$('body').addClass('desktop');

			$('.try').click(function(){
				$('.md-modal').addClass('md-show');
				$('html').addClass('md-perspective');
			});
			$('.md-overlay').click(function(){
				$('.md-modal').removeClass('md-show');
				$('html').removeClass('md-perspective');
			});
		}
	}
	// For Webapp full screen
	else {
		// Check if a new cache is available on page load.
		window.addEventListener('load', function(e) {
		  window.applicationCache.addEventListener('updateready', function(e) {
		    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
		    	//if (confirm('A new version of this site is available. Load it?')) {
		        	window.location.reload();
		        //}
		    }
		  }, false);
		}, false);
		
		$('body').addClass('webapp');

		// blocage move ecran
		$(document).bind('touchmove', function(e) {
			e.preventDefault();
		});

		// slide amis
		if($('.slide').length > 1) {
			$('#slider').iosSlider({
				desktopClickDrag: true,
				snapToChildren: true,
				navSlideSelector: '.pagination .slide',
				onSlideChange: function (args) {
					$('.pagination li').removeClass('selected');
					$('.pagination li:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
				},
				infiniteSlider: true
			});
		}

		// suppression du focus au submit des form (pour suppr le clavier)
		$('form').submit(function() {
	        $('input').blur();
	    });

		// scroll
		$('.scroll').each(function() {
  			new IScroll(this, {bounce: false});
		});
	}
});

var app = angular.module('gift', []).run(function() {
	FastClick.attach(document.body);
});

/*---------------------------------------------------------*/
/* CONTROLLERS                                             */
/*---------------------------------------------------------*/
app.controller('GiftCtrl', function ($scope, giftAppStorage) {
	// Initialisation variables
	$scope.newFriend = '';
	$scope.newGift = new Array;
	$scope.settingsOpen = false;
	$scope.selected = 0;

	// Récupération de la liste des amis dans le localstorage de l'utilisateur
	var friends = $scope.friends = giftAppStorage.get();

	// Mise à jour de la liste des amis en live
	$scope.$watch('friends', function (newValue, oldValue) {
		if (newValue !== oldValue) {
			giftAppStorage.put(friends);
			setTimeout( function() {
				if($('.slide').length < 2) {
					$('#slider').iosSlider('destroy');
				}
				else if($('.slide').length == 2) {
					$('#slider').iosSlider({
						desktopClickDrag: true,
						snapToChildren: true,
						navSlideSelector: '.pagination .slide',
						onSlideChange: function (args) {
							$('.pagination li').removeClass('selected');
							$('.pagination li:eq(' + (args.currentSlideNumber - 1) + ')').addClass('selected');
						},
						infiniteSlider: true
					});
				}
				else {
					$('#slider').iosSlider('update');
				}
				$('.scroll').each(function() {
		  			new IScroll(this, {bounce: false});
				});
			}, 1000 );
		}
	}, true);

	/*---------------------------------------------------------*/
	/* GESTION AMIS                                            */
	/*---------------------------------------------------------*/

	// Ajout d'un ami
	$scope.addFriend = function () {
		if (!$scope.newFriend) { return; }

		$scope.friends.push({
			name: $scope.newFriend.trim(),
			gifts: []
		});

		$scope.newFriend = '';
		return;
	}

	// Suppression d'un ami
	$scope.removeFriend = function (index) {
		$scope.friends.splice(index, 1);
	}

	/*---------------------------------------------------------*/
	/* GESTION CADEAUX                                         */
	/*---------------------------------------------------------*/

	// Ajout d'un cadeau
	$scope.addGift = function (friend) {
		if (!$scope.newGift) { return; }

		$scope.friends[friend].gifts.push({
			name: $scope.newGift[friend].trim(),
			given: false
		});

		$scope.newGift[friend] = '';
		return;
	}

	// Suppression d'un cadeau
	$scope.removeGift = function (friend, index) {
		$scope.friends[friend].gifts.splice(index, 1);
	}
});

/*---------------------------------------------------------*/
/* FACTORIE                                                */
/*---------------------------------------------------------*/
app.factory('giftAppStorage', function () {
	var STORAGE_ID = 'friends';

	return {
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},

		put: function (friends) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(friends));
		}
	};
});