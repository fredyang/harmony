(function() {

	hm.newViewEvent( "review", "click", function( e ) {
		return $( e.target ).hasClass( "review" );
	} );

	var ns = "api",
		version = "2",
		appNode,
		getSubEntriesNode,
		entriesNode,
		editModeNode,
		selectedEntryNameNode,
		selectedEntryNode,
		apiActionNode;

	hm.App.add( {

		name: ns,

		buildRootModel: function( modelContainer, options ) {

			var data = hm( modelContainer ).cd( ns ).getLocal( "entries" );

			if (data) {
				var localVersion = hm( modelContainer ).cd( ns ).getLocal( "version" );

				if (localVersion != version) {

					var ok = confirm( "Document is updated at server, do you want download it? If yes," +
					                  "your local document data including your change will be erased. If no, you have to" +
					                  "manually refresh document data, and you will not be asked again util we have newer data." );
					if (ok) {

						return $.getJSON( "doc-json.js" ).done( function( data ) {
							buildModel( data, modelContainer );
							entriesNode.saveLocal();
						} );

					} else {
						return buildModel( data, modelContainer );
					}
				} else {
					return buildModel( data, modelContainer );
				}

			} else {

				return $.getJSON( "doc-json.js" ).done( function( data ) {
					buildModel( data, modelContainer );
					entriesNode.saveLocal();
				} );
			}

		},

		loadable: function() {
			//insure only one instance is loaded
			return this.instanceCount === 0;
		}
	} );

	function buildModel ( entries, modelContainer ) {

		appNode = hm( modelContainer ).cd( ns );
		getSubEntriesNode = appNode.cd( "getSubEntries" );
		entriesNode = appNode.cd( "entries" );
		editModeNode = appNode.cd( "editMode" );
		selectedEntryNameNode = appNode.cd( "selectedEntryName" );
		selectedEntryNode = appNode.cd( "selectedEntry" );
		apiActionNode = appNode.cd( "apiAction" );

		hm( modelContainer ).set( ns, {

			entries: entries,

			//the template for new entries
			entries_itemTemplate: {
				name: "",
				//namespace is the path traverse from the root
				namespace: "",
				//
				shortDesc: "",

				longDesc: "",

				//each signature represent different return
				signatures: [
					{
						name: "",
						returns: "",
						shortDesc: "",
						desc: "",
						//each overload return different parameters
						overloads: [
							{
								versionAdded: "",
								name: "",
								parameters: [
									{
										name: "",
										type: "",
										desc: ""
									}
								]
							}
						],
						examples: [
							{
								desc: "",
								code: "",
								url: ""
							}
						]
					}
				]
			},

			editMode: editModeNode.getLocal() || false,

			apiAction: apiActionNode.getLocal() || "view",

			selectedEntryName: selectedEntryNameNode.getLocal() || "Home",

			//this depends on selectedEntryName node
			//so when selectedEntryName change selectedEntry will automatically change
			selectedEntry: function() {
				//this depends on api.selectedEntryName,
				//so don't use
				//var fullName = selectedEntryModel.get( );
				//because it will not register the dependency
				var fullName = this.get( "selectedEntryName" );

				return $( entries ).filter( function( index, entry ) {
					return fullName === getEntryFullName( entry );
				} )[0];
			},

			//the entry is optional
			//this depends on entries node
			getSubEntries: function( entry ) {
				var namespace = entry ? getEntryFullName( entry ) : "";
				return $( this.get( "entries" ) ).filter(
					function( index, item ) {
						return item.namespace == namespace;
					} ).get();
			},

			handlers: {

				//handler of delete button on tool bar
				deleteSelected: function( e ) {
					var selectedEntry = selectedEntryNode.get();
					cascadeDelete( selectedEntry, selectedEntryNameNode.get() );
					refreshTree();
				},

				//handler of undo button on tool bar
				discardChange: function( e ) {
					entriesNode.clearLocal();
					location.reload();
				},

				//subscriber is top node of the tree
				expandParentNodeForSelectedEntry: function( e ) {
					var selectedEntryName = e.publisher.get();
					this.find( "a[data-tabLink]" ).each( function() {
						var $this = $( this );
						if (selectedEntryName.startsWith( $this.attr( "data-tabLink" ) )) {
							//change the icon on the left to be the "plus" icon
							$this.prev().removeClass( "ui-icon-plus" ).addClass( "ui-icon-minus" );
							//show the ul's children
							$this.next().show();
						}
					} );
				},

				//view handler for event $toggleExpander
				//seems that this violate principle that
				//the view handler should not modify view
				toggleExpander: function( e ) {
					var $button = e.originalPublisher;
					if ($button.is( "a" )) {
						$button = $button.prev();
					}

					$button.toggleClass( "ui-icon-plus ui-icon-minus" )
						.nextAll( "ul" )
						.toggle();
				},

				//view handler, subscriber is "api.entries", publisher is the list view
				review: function( e ) {
					var fullName = getEntryFullName( entriesNode.get()[e.selectedRowIndex()] );
					selectedEntryNameNode.set( fullName );
					apiActionNode.set( "view" );
				},

				//view handler, subscriber is "api.entries", publisher is the list view
				edit: function( e ) {
					var fullName = getEntryFullName( entriesNode.get()[e.selectedRowIndex()] );
					selectedEntryNameNode.set( fullName );
					apiActionNode.set( "edit" );
				},

				remove: function( e ) {
					var deletedEntry = entriesNode.get( e.selectedRowIndex() );
					var selectedEntryName = selectedEntryNameNode.get();
					cascadeDelete( deletedEntry, selectedEntryName );
					refreshTree();
				},

				cancelEdit: function( e ) {
					entriesNode.resetShadowItem();
					apiActionNode.set( "view" );

				}

			}
		} );

		appNode.cd( "version" ).set( version ).saveLocal();

		function cascadeDelete ( entry, selectedEntryName ) {

			var children = appNode.get( "getSubEntries", entry );

			for (var i = 0; i < children.length; i++) {
				cascadeDelete( children[i], selectedEntryName );
			}

			if (getEntryFullName( entry ) == selectedEntryName) {
				selectedEntryNameNode.set( "" );
			}
			entriesNode.removeItem( entry );
		}

		hm.bookmarkable( apiActionNode.path, selectedEntryNameNode.path );

		entriesNode.initShadowEdit();

		entriesNode.sub( entriesNode, "move", function( e ) {
			var selectedEntry = this.get( e.proposed ),
				newSelectedEntryName = getEntryFullName( selectedEntry ),
				selectedEntryName = selectedEntryNameNode.get();

			if (newSelectedEntryName != selectedEntryName) {
				selectedEntryNameNode.update( newSelectedEntryName );
			} else {
				selectedEntryNameNode.triggerChange();
			}
			e.stopPropagation();
		} );

		selectedEntryNameNode.sub( entriesNode, "afterCreate.1", function( e ) {
			var newFullName = getEntryFullName( e.proposed );
			refreshTree();
			this.set( newFullName );
		} );

		hm.handle( selectedEntryNode, "init afterUpdate", function( e ) {
			if (apiActionNode.get() == "edit") {
				entriesNode.editShadowItem( e.publisher.get() );
			} else {
				if (entriesNode.get( "*edit.item" ) !== null) {
					entriesNode.resetShadowItem();
				}
			}
		} );

		apiActionNode.handle( "afterUpdate", function( e ) {
			if (apiActionNode.get() == "edit" && !entriesNode.get( "*edit.item" )) {
				entriesNode.editShadowItem( selectedEntryNode.get() );
			}
		} );

		//this is to synchronize the documents tab when a selected entry is updated
		hm.handle( entriesNode, "afterUpdate.1", function( e ) {

			var newEntry = e.proposed,
				oldEntry = e.removed,
				oldSelectedEntryName = getEntryFullName( oldEntry ),
				newSelectedEntryName = getEntryFullName( newEntry );

			if (oldSelectedEntryName !== newSelectedEntryName) {

				$( entries ).each(
					function( index, item ) {
						var newName = item.namespace.replace( oldSelectedEntryName, newSelectedEntryName );
						if (item.namespace != newName) {
							item.namespace = newName;
							entriesNode.trigger( index, "updateFullName", null, null );
						}
					} );
			}

			if (oldSelectedEntryName == newSelectedEntryName &&
			    selectedEntryNameNode.get() == oldSelectedEntryName) {

				//update "api.selectedEntryName" will not trigger afterUpdate
				//because new value is the same as old value
				//so we need to manually trigger the change

				selectedEntryNameNode.triggerChange();

			} else {

				//the reason delay the set is that, the tree on the right need
				//to be re-rendered, the delay is to let the re-rendering complete
				//first, then set it.
				refreshTree();
				selectedEntryNameNode.set( newSelectedEntryName );
			}

		} );

		entriesNode.cacheable();
		selectedEntryNameNode.cacheable();
		apiActionNode.cacheable();
		editModeNode.cacheable();

	}

	function refreshTree () {
		getSubEntriesNode.trigger( "nameChanged" );
	}

	//namespace + name
	function getEntryFullName ( entry ) {
		return entry.namespace ? entry.namespace + "." + entry.name : entry.name;
	}

	$.views.helpers( {

		htmlEncode: function( value ) {
			return $( '<div/>' ).text( value ).html();
		},

		getEntryFullName: getEntryFullName,

		getParentNamespaces: function( entry ) {

			var rtn = [],
				namespaces = entry.namespace.split( "." ),
				prefix = "",
				fullName;

			for (var i = 0; i < namespaces.length; i++) {
				fullName = prefix ? prefix + "." + namespaces[i] : namespaces[i];
				prefix = fullName;
				if (fullName) {
					rtn.push( {
						name: namespaces[i],
						fullName: fullName
					} );
				}
			}
			return rtn;
		},

		getExpanderClass: function( entry ) {
			var selectedEntryName = selectedEntryNameNode.get();
			var fullName = getEntryFullName( entry );
			if (selectedEntryName.startsWith( fullName )) {
				return "ui-icon-minus";
			} else {
				var entryLevel = entry.namespace.split( "." ).length;
				return entryLevel < 2 ? "ui-icon-minus" : "ui-icon-plus";
			}
		},

		getSubEntryStyle: function( entry ) {
			var selectedEntryName = selectedEntryNameNode.get();
			var fullName = getEntryFullName( entry );
			if (selectedEntryName.startsWith( fullName )) {
				return "";
			} else {
				var entryLevel = entry.namespace.split( "." ).length;
				return entryLevel < 2 ? "" : "style='display:none'";
			}
		}

	} );

})();