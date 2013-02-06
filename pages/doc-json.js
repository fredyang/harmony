[
    {
        "name": "Core",
        "type": "",
        "namespace": "",
        "shortDesc": "Core",
        "longDesc": "<p>This section is the reference the core path of Harmony. In the documents here, When we refer the model, it means repository node, when we refer to view, it means jQuery object or DOM element.\n</p>",
        "signatures": []
    },
    {
        "name": "Repository",
        "type": "category",
        "namespace": "Core",
        "shortDesc": "Repository",
        "signatures": [],
        "longDesc": "<p>In Harmony, all models are stored in a repository, a plain old JavaScript object,  this is an internal object used by Harmony. Although it is possible you access it directly, you should use repository node and its method.</p>\n\n"
    },
    {
        "name": "Constructor ( hm )",
        "type": "method",
        "namespace": "Core.Repository.Node",
        "shortDesc": "hm()",
        "signatures": [
            {
                "name": "hm(path[, value])",
                "returns": "Node",
                "shortDesc": "Accepts a string of path and create a node pointing to a node in the repository. ",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm(path)",
                        "parameters": [
                            {
                                "name": "path",
                                "type": "String",
                                "desc": "A string of path in the repository"
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "A optional value to be set to model at the path"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "Create a node and use it to access model in repository",
                        "code": "$(function () {\n//create a root node\nvar root = hm();\n\nroot.set(\"firstName\", \"Tom\");\nhm.log(root.get(\"firstName\"));\n\n//create a node with path\nvar firstName = hm(\"firstName\");\nfirstName.set(\"Jerry\");\nhm.log(firstName.get());\n\nvar lastName = hm(\"lastName\", \"Yang\");\nhm.log(lastName.get());\n});",
                        "url": "http://jsbin.com/etivur/1",
                        "jsbin": true
                    }
                ]
            }
        ],
        "longDesc": "<p>hm is the constructor to build a node. It is also the root namespace of Harmony.</p>"
    },
    {
        "name": "set",
        "type": "method",
        "namespace": "Core.Model.Node",
        "shortDesc": "node.set()",
        "signatures": [
            {
                "signature": "",
                "desc": "It can be used to set value to a node or call the function at the node. If the node value is a function, this function will be called in the context of node of parent node of this node.",
                "longDesc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "title": "",
                        "parameters": [
                            {
                                "name": "subNodePath",
                                "type": "string",
                                "desc": "optional, relative path from the context node to traverse to sub-node"
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "any value"
                            }
                        ],
                        "name": "node.set([subPath,] value)"
                    }
                ],
                "examples": [
                    {
                        "desc": "description of code",
                        "code": "<div data-sub=\"@ns:customer\">\n<div>First Name: <input data-sub=\"`val:firstName\" type=\"text\" /></div>\n<div>Last Name: <input data-sub=\"`val:lastName\" type=\"text\" /></div>\n<div>Full Name: <span data-sub=\"`text:fullName\"></span></div>\n</div>",
                        "url": "http://jsbin.com/etihon/4",
                        "jsbin": true
                    }
                ],
                "name": "node.set([subPath,] value)",
                "returns": "Node",
                "shortDesc": "set value to the repository node"
            }
        ]
    },
    {
        "name": "get",
        "type": "method",
        "namespace": "Core.Model.Node",
        "shortDesc": "node.get()",
        "signatures": [
            {
                "signature": "",
                "desc": "",
                "longDesc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "title": "",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "the sub path relative to the current proxy"
                            }
                        ],
                        "name": "proxy.get([subPath])"
                    }
                ],
                "examples": [],
                "name": "proxy.get([subPath])",
                "returns": "object",
                "shortDesc": "Get the value at the current path of the proxy or sub-path of the proxy"
            },
            {
                "name": "hm.get([fullPath])",
                "returns": "object",
                "shortDesc": "This is shortcut of hm().get([fullPath])",
                "desc": "Instead of creating a proxy, and then call proxy.get(), you can use a shortcut to get the value to the model at the full path.",
                "overloads": [
                    {
                        "versionAdded": "0.2",
                        "name": "hm.get([fullPath])",
                        "parameters": [
                            {
                                "name": "fullPath",
                                "type": "string",
                                "desc": "full path of the model, optional, if missing get value of root object"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "Unified Subscription",
        "type": "",
        "namespace": "Core",
        "shortDesc": "Unified Subscription",
        "signatures": [],
        "longDesc": "<p>The subscription feature depends on DOM event and repository event. They are unified in Harmony. What this means that, Harmony expose jQuery event and repository event in the same interface, user can use the same syntax to subscribe events.\n</p>"
    },
    {
        "name": "Node",
        "type": "category",
        "namespace": "Core.Repository",
        "shortDesc": "Node",
        "signatures": [],
        "longDesc": "<p>A node is used to access the data in repository so that model events can be trigger events inside the access method of node. A node is associated with a path which is used to traverse to the node. For example, path of \"mailApp.contacts.0.phones.1\" can be used to access a node in mailApp object's first contact 's second phone number. When the node does not exists,  for example the mailApp has only one contact, and you use read method such as \"get\" to access \"mailApp.contacts.3.phones.1\", it will return undefined. If you use \"change\" method such as \"set\" to access this nonexistent node, it will throw exception like \"invalid update on unreachable node 'invalid access model using path mailApp.contacts.3.phones.1'\"</p>\n\n<p>We should use node method to change model whenever possible, because model events triggered inside node method is fundamentally important in Harmony. In the following, it demonstrate the difference between updating model directly and updating model using node method.</p>\n\n\n<pre  data-sub=\"prettyprint:.;preview:_|http://jsbin.com/ucisep/4\">\n$(function () {\n  hm.set(\"person\", {\n    firstName: \"\",\n    lastName: \"\"\n  });\n  \n  hm.handle(\"person\", \"afterUpdate.*\", function (e) {\n    \n    hm.log(\"event logging: \" + e.originalPublisher.path + \" is changed to \" + e.proposed + \" from \" + e.removed);\n  \n  });\n  \n  //update model directly, the following will not trigger \n  //model event\n  var person = hm.get(\"person\");\n  hm.log(\"----updating model directly----\");\n  person.firstName = \"John\";\n  person.lastName = \"Doe\";\n  hm.log(hm().get(\"person.firstName\"));\n  hm.log(hm().get(\"person.lastName\"));\n  \n  \n  //update model using node method, and it will trigger events\n  var nav = hm(\"person\");\n  hm.log(\"----updating model using node method----\");\n  nav.set(\"firstName\", \"Jane\");\n  nav.set(\"lastName\", \"Roe\");\n});\n</pre>\n\n<p>Sometimes, we do need to update model directly for reason such as performance, raising custom event. The following example demonstrate how to access model directly and raising custom events.</p>\n\n<pre  data-sub=\"prettyprint:.;preview:_|http://jsbin.com/iwonad/2\">\n$(function () {\n\n  hm.set(\"person\", {\n    firstName: \"\",\n    lastName: \"\",\n    changeName: function (firstName, lastName) {\n      \n      var person = this.get();\n      var oldPerson = hm.util.clone(person);\n      person.firstName = firstName;\n      person.lastName = lastName;\n      //raised a custom event\n      this.trigger(\"nameChanged\", person, oldPerson);\n    }\n  });\n  \n  hm.handle(\"person\", \"nameChanged\", function (e) {\n    hm.log(\"person is changed from \" + JSON.stringify(e.removed) + \" to \" + JSON.stringify(e.proposed));\n    \n  });\n  \n  hm(\"person\").set(\"changeName\", \"John\", \"Doe\");\n});\n</pre>"
    },
    {
        "name": "Template",
        "type": "",
        "namespace": "Core",
        "shortDesc": "Template",
        "longDesc": "<p>Template module include several activities, workflow types, subscription group, and template engine adapter.</p>\n\n<p>In Harmony, a complex view is rendered by template. And this process is handled by template workflow which is an instance of workflow type. All template workflow type use three special activities, initialize activity <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.templateOptions\">templateOptions</a>, convert activity <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.dataToMarkup\">dataToMarkup</a>, and finalize activity <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.parseSub\">parseSub</a>.</p>",
        "signatures": []
    },
    {
        "name": "get",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.get()",
        "longDesc": "The method retrieve model value. If  the node is a function, it will call the function with optional parameter, and return the result of function call. Inside the function, the \"this\" context refer to the node pointing to parent node, \"this.previous\" refer to node pointing the current node.",
        "signatures": [
            {
                "name": "node.get(subPath, [parameter1, [parameter2], ..]",
                "returns": "object",
                "shortDesc": "get model value",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.get(subPath)",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node's path"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "use node.get to retrieve value in repository",
                        "code": "$(function () {\n\n  hm().set(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    fullName: function () {\n      \n      return this.get(\"firstName\") + \",\" + this.get(\"lastName\");\n    },\n    message: function(greeting) {\n      hm.log(\"'this' refers to perent node, this.path == \" + this.path);\n      hm.log(\"'this.previous' refers to current node, this.pervious.path == \" + this.previous.path);\n      return greeting + \", \" + this.get(\"fullName\");\n    }\n  });\n  \n  hm.log(hm().get(\"person.firstName\"));\n  hm.log(hm(\"person\").get(\"fullName\"));\n  hm.log(hm(\"person\").get(\"message\", \"Hello\"));\n});",
                        "url": "http://jsbin.com/ogomur/6",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "hm.get(fullPath, [ paramter1, [parameter2, [..]] ]",
                "returns": "object",
                "shortDesc": "a shortcut to hm().get",
                "desc": "This is equivalent to hm().get(fullPath, [ paramter1, [parameter2, [..]] ]",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.get(fullPath, [ paramter1, [parameter2, [..]] ]",
                        "parameters": [
                            {
                                "name": "fullPath",
                                "type": "string",
                                "desc": "a absolute path"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "set",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.set()",
        "longDesc": "set value to a node in repository. If the node does not exist before the call, it will call node.create() method and raise events \"beforeCreate\" and \"afterCreate\". If the node already exist before the call, it will call node.update() method, and raise events \"beforeUpdate\", \"afterUpdate\". If the workflow of the subscription to \"beforeCreate\" or \"beforeUpdate\" event signal error, then the set operation will be aborted.  If the value of the node is a function, the method will call the function in the context of parent node.",
        "signatures": [
            {
                "name": "node.set(subPath, value, value2, ..)",
                "returns": "Node",
                "shortDesc": "set value to a node in repository",
                "desc": "set a value to a node in repository. If current value of the node is a function, it will call the function. Inside the function, the \"this\" context refer the node pointing to the parent node.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.set([subPath,] value, value2, ..)",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "sub-path relative to the path of node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following show how to use \"set\" method to change value of a node or call the function of node, it also show what events will be trigger in the set method.",
                        "code": "  hm.set( \"person\", {\n\tfirstName: \"\",\n\tlastName: \"\",\n\tchangeName: function( firstName, lastName ) {\n\t\t//this point to the current model object\n\t\tthis.set( \"firstName\", firstName );\n\t\tthis.set( \"lastName\", lastName );\n\t}\n  });\n  \n  hm(\"person\").handle(\"*\", function (e) {\n    hm.log(\"path '\" + e.originalPublisher.path + \"' trigger event '\" + e.originalType, \"red\");\n  });\n  \n  hm().set(\"person.firstName\", \"John\");\n  hm.log(hm().get(\"person.firstName\"));\n  \n  hm(\"person.lastName\").set(\"Doe\");\n  hm.log(hm().get(\"person.lastName\"));\n  \n  hm.log(\"---calling changeName---\");\n  \n  hm(\"person\").set(\"changeName\", \"Jane\", \"Roe\");\n  hm.log(hm().get(\"person.firstName\"));\n  hm.log(hm().get(\"person.lastName\"));",
                        "url": "http://jsbin.com/arireh/7",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "node.set(force, [subPath,] value)",
                "returns": "Node",
                "shortDesc": "set a value to node in repository",
                "desc": "If force is true, and the workflow of the susbcription to \"beforeXxx\" event signal error,  error will be ignored.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.set(force, [subPath,] value)",
                        "parameters": [
                            {
                                "name": "force",
                                "type": "boolean",
                                "desc": "is the operation by force"
                            },
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node"
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "value to set"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following show how to set by force to suppress error in beforeCreate and beforeUpdate event",
                        "code": "hm.handle(\"length\", \"beforeCreate beforeUpdate\", \nfunction (e) {\n  if (e.proposed > 100) {\n    hm.log(\"error happen in event '\" + e.type + \"'\", \"red\");\n    e.error(); \n  }\n});\n\n//create\nhm(\"length\").set(200);\nhm.log(\"the value is unchanged: \" + hm.get(\"length\"), \"green\");\n\nhm.log(\"set by force to suppress event in beforeCreate\");\nhm(\"length\").set(true, 200);\nhm.log(\"the value is changed to \" + hm.get(\"length\"));\n\n//update\nhm.set(\"length\", 300);\nhm.log(\"the value is unchanged: \" + hm.get(\"length\"), \"green\");\n\nhm.log(\"set by force to suppress event in beforeUpdate\");\nhm(\"length\").set(true, 300);\nhm.log(\"the value is changed to \" + hm.get(\"length\"));\n\nhm.log(\"set by force to suppress event in beforeUpdate\");\nhm().set(true, \"length\", 400);\nhm.log(\"the value is changed to \" + hm.get(\"length\"));",
                        "url": "http://jsbin.com/iquhex/6",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "hm.set(fullPath, value, value2, ..)",
                "returns": "Node",
                "shortDesc": "it is shortcut to hm().set(fullPath, value, value2, ..)",
                "desc": "",
                "overloads": [],
                "examples": []
            },
            {
                "name": "hm.set(force, [subPath,] value)",
                "returns": "node",
                "shortDesc": "it is shortcut to hm().set(force, [subPath,] value)",
                "desc": "",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "getJson",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.getJson()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.getJson([subPath,] [[parameter1, [parameter2], ..])",
                "returns": "string",
                "shortDesc": "Get the value of node and transform it to a json format string",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.getJson([subPath,] [[parameter1, [parameter2], ..])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "raw",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.raw()",
        "longDesc": "<p>Similar to the \"get\" or \"set\" method, you can use it to get or set a value to node in repository. Unlike these two methods, if the value of the node is an function, it will not call the function, instead it will just get a function or set the function.</p>",
        "signatures": [
            {
                "name": "node.raw([subPath])",
                "returns": "object.",
                "shortDesc": "get a value to a node in repository without conversion",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.raw([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n  hm().set(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    fullName: function () {\n      return this.get(\"firstName\") + \",\" + this.get(\"lastName\");\n    },\n    message: function(greeting) {\n      return greeting + \", \" + this.get(\"fullName\");\n    }\n  });\n  hm.log(\"---get---\");\n  hm.log(hm().get(\"person.firstName\"));\n  hm.log(hm(\"person\").get(\"fullName\"));\n  hm.log(hm(\"person\").get(\"message\", \"Hello\"));\n  hm.log(hm(\"person.message\").get(\"\", \"Bye\"));\n  \n  hm.log(\"---get raw---\");\n  hm.log(hm().raw(\"person.firstName\"));\n  hm.log(hm(\"person.fullName\").raw());\n  hm.log(hm(\"person\").raw(\"message\"));\n});",
                        "url": "http://jsbin.com/ogomur/5",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "node.raw(subPath, value)",
                "returns": "node",
                "shortDesc": "set a value to node in repository without conversion",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.raw(subPath, value)",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "a sub-path relative to node "
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "the value to be set to the node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  hm.set( \"person\", {\n\tfirstName: \"\",\n\tlastName: \"\",\n\tchangeName: function( firstName, lastName ) {\n\t\t//this point to the current model object\n\t\tthis.set( \"firstName\", firstName );\n\t\tthis.set( \"lastName\", lastName );\n\t}\n  });\n  \n  \n  hm().raw(\"person.firstName\", \"John\");\n  hm.log(hm().get(\"person.firstName\"));\n  hm(\"person.lastName\").raw(\"\", \"Doe\");\n  hm.log(hm().get(\"person.lastName\"));\n  \n  hm.log(hm().raw(\"person.changeName\"));\n  hm(\"person\").raw(\"changeName\", \"overwrite function value\");\n  hm.log(hm().raw(\"person.changeName\"));\n});",
                        "url": "http://jsbin.com/arireh/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "accessor",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "naviagor.accessor()",
        "longDesc": "<p>This is low level api to access node in repository. It is normally internally used by node method, such as \"get\", \"set\". You can write custom node method with this.</p>\n\n",
        "signatures": [
            {
                "name": "node.accessor()",
                "returns": "accessor object",
                "shortDesc": "get the accessor object of a model node.",
                "desc": "<p>It return an object like below.</p>\n\n<pre data-sub=\"prettyprint:._\">\n{\n  physicalPath: physicalPath,\n  hostObj: hostObj,\n  index: index\n}\n</pre>\n\n<p>\nThe hostObj points to the parent of the node which is being accessed.\n</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.accessor( [subPath], [readOnly])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "a optional sub-path of model node"
                            },
                            {
                                "name": "readOnly",
                                "type": "boolean",
                                "desc": "set to true, if you only use the accessor to read the model node. By default it is false"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n  \n  hm.fn.double = function () {\n    var accessor  = this.accessor();\n    hm.log(\"----dump accessor-----\");\n    \n    hm.log(JSON.stringify(accessor));\n    \n    var items = accessor.hostObj[accessor.index];\n    var oldItems = hm.util.clone(items);\n    for (var i = 0; i < items.length; i++) {\n        items[i] = items[i] * 2; \n    }\n    this.trigger(\"doubled\", items, oldItems);\n    return this;\n    \n  };\n    \n  hm(\"items\", [1, 2, 3]);\n  \n  hm(\"items\").handle(\"doubled\", function (e) {\n    hm.log(\"----doubled event dump-----\");\n    hm.log(\"items change from \" + JSON.stringify(e.removed) + \" to \" + JSON.stringify(e.proposed));  \n  });\n  \n  hm(\"items\").double();\n  \n});",
                        "url": "http://jsbin.com/afoluf/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "create",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.create()",
        "longDesc": "insert a node at the path in repository. Most of time, you should use node.set method, it will this method if the  node does not exist.",
        "signatures": [
            {
                "name": "node.create( [force,] subPath, value)",
                "returns": "node",
                "shortDesc": "",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.create( [force,] subPath, value)",
                        "parameters": [
                            {
                                "name": "force",
                                "type": "boolean",
                                "desc": "set to true if you want to skip triggering beforeCreate event"
                            },
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "sub-path relative to the node"
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "value to inserted"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "update",
        "type": "method",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.update()",
        "longDesc": "update a node at the path in repository. Most of time, you should use node.set method, it will this method if the node already exists.",
        "signatures": [
            {
                "name": "node.update( [force,] subPath, value )",
                "returns": "node",
                "shortDesc": "",
                "desc": "\n",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.update( [force,] [subPath,] value )",
                        "parameters": [
                            {
                                "name": "force",
                                "type": "boolean",
                                "desc": "optional, by default it is false, set to true if you want to skip triggering \"beforeUpdate\" event."
                            },
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional, sub-path relative the node"
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "the value to set"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "extend",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.extend()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.extend(object)",
                "returns": "node",
                "shortDesc": "extend a model node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.extend(object)",
                        "parameters": [
                            {
                                "name": "object",
                                "type": "object",
                                "desc": "an property bag to be extended to a model node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  hm().extend({\n    firstName: \"John\",\n    lastName: \"Doe\"\n    \n  });\n  \n  //the above is equivelent to \n  /*\n   hm().set(\"firstName\", \"John\");\n   hm().set(\"lastName\", \"Doe\");\n  */\n  \n  \n  hm.log(hm.get(\"firstName\"));\n  hm.log(hm.get(\"lastName\"));\n});",
                        "url": "http://jsbin.com/acohop/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "del",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.del()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.del([subPath])",
                "returns": "object",
                "shortDesc": "delete a node in repository, and return the deleted value",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.del([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative the node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n hm.set(\"name\", \"John\");\n  \n  hm.log(hm().del(\"name\"));\n  \n  hm().del(\"name\");\n  \n  hm.log(hm().del(\"name\"));\n  \n});",
                        "url": "http://jsbin.com/ewapor/1",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "hm.del(subPath)",
                "returns": "object",
                "shortDesc": "a shortcut to hm().del(subPath), return the deleted value",
                "desc": "",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "createIfUndefined",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "node.createIfUndefined()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.createIfUndefined(subPath, value)",
                "returns": "node",
                "shortDesc": "insert a node to repository if the node is not defined",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.createIfUndefined(subPath, value);",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "sub-path relative to the node"
                            },
                            {
                                "name": "value",
                                "type": "object",
                                "desc": "a value to be inserted to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "pushStack",
        "type": "",
        "namespace": "Core.Repository.Node.Navigation",
        "shortDesc": "node.pushStack()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.pushStack(newNode)",
                "returns": "node",
                "shortDesc": "save the node to the new node's previous property, this method is used for traversal.",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.pushStack(newNode)",
                        "parameters": [
                            {
                                "name": "newNode",
                                "type": "node",
                                "desc": "the new navgator"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  var first = hm(\"first\");\n  var second = hm(\"second\");\n  var secondCopy = first.pushStack(second);\n  hm.log(\"secondCopy == second : \" + (secondCopy === second));\n  hm.log(\"secondCopy.previous == first : \" + (secondCopy.previous === first));\n\n});",
                        "url": "http://jsbin.com/uvavuw/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "Shadow Node",
        "type": "",
        "namespace": "Core.Repository",
        "shortDesc": "Shadow Node",
        "longDesc": "<p>In repository each node (main node) can have a shadow node.  They are normally use in <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins\">plugins development</a>.\n</p>",
        "signatures": []
    },
    {
        "name": "cd",
        "type": "",
        "namespace": "Core.Repository.Node.Navigation",
        "shortDesc": "node.cd([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.cd([subPath])",
                "returns": "node",
                "shortDesc": "create new node at the path relative to the current node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.cd([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "a optional sub-path relative to the current node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  var person = hm(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\"\n  });\n  \n  hm.log('person.cd(\"firstName\").path == \"person.firstName\" : ' + (person.cd(\"firstName\").path == \"person.firstName\"));\n  \n  var firstName = person.cd(\"firstName\");\n  \n  hm.log('firstName.previous.path == \"person\": ' + (firstName.previous.path == \"person\"));\n  \n  hm.log('firstName.cd(\"..\").path == \"person\" : ' + (firstName.cd(\"..\").path == \"person\") );\n  \n  hm.log('firstName.cd(\"/\").path === \"\"' + (firstName.cd(\"/\").path === \"\"));\n  \n  hm.log('firstName.cd(\"...\").path === \"\"' + (firstName.cd(\"...\").path === \"\"));\n  \n  hm.log('firstName.cd(\"*\").path == hm(\"person.firstName*\").path) : ' + (firstName.cd(\"*\").path == hm(\"person.firstName*\").path));\n\n  var firstNameShadow = firstName.cd(\"*\");\n  \n  hm.log('firstName.main().path == \"person.firstName\" : ' + (firstName.main().path == \"person.firstName\"));\n  \n  hm.log('firstName.shadow().path === firstNameShadow.path : ' + (firstName.shadow().path === firstNameShadow.path));\n  });",
                        "url": "http://jsbin.com/ugiluw/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "parent",
        "type": "",
        "namespace": "Core.Repository.Node.Navigation",
        "shortDesc": "node.parent()",
        "longDesc": "this is equivalent  to node.cd(\"..\")",
        "signatures": []
    },
    {
        "name": "sibling",
        "type": "",
        "namespace": "Core.Repository.Node.Navigation",
        "shortDesc": "node.sibling(path)",
        "longDesc": "This is a shortcut to node.cd(\"..\" + path);",
        "signatures": []
    },
    {
        "name": "Manipulation",
        "type": "",
        "namespace": "Core.Repository.Node",
        "shortDesc": "Manipulation",
        "longDesc": "",
        "signatures": []
    },
    {
        "name": "Navigation",
        "type": "",
        "namespace": "Core.Repository.Node",
        "shortDesc": "Navigation",
        "longDesc": "",
        "signatures": []
    },
    {
        "name": "main",
        "type": "",
        "namespace": "Core.Repository.Node.Navigation",
        "shortDesc": "node.main()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.main()",
                "returns": "node",
                "shortDesc": "If current node is a shadow object, return its main object",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.main()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  hm(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\"\n  });\n \n  hm.log(hm(\"person.firstName*x\").main().logicalPath());\n  hm.log(hm(\"person.firstName*x*y\").main().logicalPath());\n  hm.log(hm(\"person.firstName*x*y*z\").main().logicalPath());\n  \n});",
                        "url": "http://jsbin.com/uhohan/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "shadow",
        "type": "",
        "namespace": "Core.Repository.Node.Navigation",
        "shortDesc": "node.shadow()",
        "longDesc": "This is a shortcut of node.cd(\"*\"), it return the shadow node of the current node.",
        "signatures": []
    },
    {
        "name": "Path",
        "type": "",
        "namespace": "Core.Repository",
        "shortDesc": "Path",
        "longDesc": "<p>There two kind of path, absolute path, and sub-path (relative path).  The absolute path start from root, sub-path start from current node. In the following, you use absolute path.</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm(\"person.firstName\", \"John\");\nhm.get(\"person.firstName\");\nhm.subscribe(\"person.firstName\", $(\"#txtFirstName\"), handler);\n$(\"#lable\").sub(\"person.firstName\", \"afterUpdate\", handler);\n</pre>\n\n<p>The following code use sub-path.\n<p>\n\n<pre data-sub=\"prettyprint:_\">\nnode.cd(\"..\");\nnode.set(\"firstName\", \"John\");\nnode.getPath(\"firstName\");\n</pre>\n\n<p>The following is summary of path calculation.  One special path is subPath is \"_\", it is used in subscription when subscriber is \"_\", it means subscriber is null. For demo, please see <a target=\"_blank\" href=\"http://jsbin.com/italik/3/edit\">this</a>.\n</p>\n\n<table class=\"code\"><tbody><tr><th>context path</th><th>sub path</th><th>merge path</th></tr><tr><td>person</td><td>firstName</td><td>person.firstName</td></tr><tr><td>person</td><td>.firstName</td><td>person.firstName</td></tr><tr><td>person.firstName</td><td>..</td><td>person</td></tr><tr><td>app.person.firstName</td><td>...</td><td>app</td></tr><tr><td>person</td><td>phone.home</td><td>person.phone.home</td></tr><tr><td>person</td><td>*validations</td><td>person*validations</td></tr><tr><td>person</td><td>*validations.1</td><td>person*validations.1</td></tr><tr><td>person.firstName</td><td>/</td><td></td></tr><tr><td>person</td><td>/addresses.0</td><td>addresses.0</td></tr><tr><td>person</td><td>_</td><td>_</td></tr><tr><td>person*edit.item</td><td>&lt;</td><td>person</td></tr><tr><td>person*edit.item</td><td>&lt;*edit.selectedIndex</td><td>person*edit.selectedIndex</td></tr><tr><td>person*edit.item</td><td>&lt;firstName</td><td>person.firstName</td></tr></tbody></table>",
        "signatures": []
    },
    {
        "name": "getPath",
        "type": "",
        "namespace": "Core.Repository.Path",
        "shortDesc": "node.getPath([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.getPath([subPath])",
                "returns": "string",
                "shortDesc": "combine node.path and sub-path in to a full path",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.getPath([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "a optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "logicalPath",
        "type": "",
        "namespace": "Core.Repository.Path",
        "shortDesc": "node.logicalPath([subPath])",
        "longDesc": "<p>We use \"*\" to access shadow object, Harmony will convert the shadow path in to a physical path, which is not user friendly. for example logical path \"a*b*c*d\" will be converted to \"__hm.__hm#__hm##a##b#c.d\" . For debugging purpose, we want to use convert the physical path into a logical path which is user friendly.\n</p>",
        "signatures": [
            {
                "name": "node.logicalPath([subPath])",
                "returns": "string",
                "shortDesc": "get a logical path from node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.logicalPath([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "a optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            },
            {
                "name": "hm.util.toLogicalPath(path)",
                "returns": "string",
                "shortDesc": "convert a path into logicalPath",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.util.toLogicalPath(path)",
                        "parameters": [
                            {
                                "name": "path",
                                "type": "string",
                                "desc": "a full path"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "physicalPath",
        "type": "",
        "namespace": "Core.Repository.Path",
        "shortDesc": "node.physicalPath([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.physicalPath([subPath])",
                "returns": "string",
                "shortDesc": "combine sub-path with node's path and return a physical path",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.physicalPath([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "a optional sub-path relative to node"
                            }
                        ]
                    }
                ],
                "examples": []
            },
            {
                "name": "hm.util.toPhysicalPath(fullPath)",
                "returns": "string",
                "shortDesc": "convert a path to physical path",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.util.toPhysicalPath(fullPath)",
                        "parameters": [
                            {
                                "name": "fullPath",
                                "type": "string",
                                "desc": "a full path"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "pathContext",
        "type": "",
        "namespace": "Core.Repository.Path",
        "shortDesc": "node.pathContext()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.pathContext()",
                "returns": "string",
                "shortDesc": "return the context part of path",
                "desc": "If a path is \"a.b.c\", the the context part is \"a.b\"",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "pathIndex",
        "type": "",
        "namespace": "Core.Repository.Path",
        "shortDesc": "node.pathIndex()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.pathIndex()",
                "returns": "string",
                "shortDesc": "return the index part of path",
                "desc": "If node's path is \"a.b.c\", it returns \"c\"",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "Array methods",
        "type": "",
        "namespace": "Core.Repository.Node",
        "shortDesc": "Array methods",
        "longDesc": "These section contains the node methods specific for array node.  These methods should be used for array nodes. If they are used for array nodes, exception will be throw.",
        "signatures": []
    },
    {
        "name": "indexOf",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.indexOf(item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.indexOf(item)",
                "returns": "number",
                "shortDesc": "return the index of the item in the array",
                "desc": "If the item is in the array, return the index of the item in the array, otherwise return -1.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.indexOf(item)",
                        "parameters": [
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "the object to be searched inside the array."
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  hm(\"items\", [1, 2, 3]);\n  hm.log(hm(\"items\").indexOf(3));\n  \n});",
                        "url": "http://jsbin.com/ikahit/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "contains",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.contains(item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.contains(item)",
                "returns": "boolean",
                "shortDesc": "",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.contains(item)",
                        "parameters": [
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "the object to be searched in the array"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "$(function () {\n\n  hm(\"items\", [1, 2, 3]);\n  hm.log(hm(\"items\").contains(3));\n  hm.log(hm(\"items\").contains(4));\n \n  \n});",
                        "url": "http://jsbin.com/uxojos/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "first",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.first()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.first()",
                "returns": "object",
                "shortDesc": "return the first item of the array",
                "desc": "",
                "overloads": [],
                "examples": [
                    {
                        "desc": "",
                        "code": "hm(\"items\", [1, 2, 3]);\nhm.log(\"the first item is \" +  hm(\"items\").first());",
                        "url": "http://jsbin.com/ocajim/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "last",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.last()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.last()",
                "returns": "object",
                "shortDesc": "return the last item of array node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.last()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": " hm(\"items\", [1, 2, 3]);\n hm.log(\"the last items is \" + hm(\"items\").last());\n",
                        "url": "http://jsbin.com/emetih/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "push",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.push(item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.push(item)",
                "returns": "node",
                "shortDesc": "push an item into array node",
                "desc": "<p>This method will raise an event \"afterCreate.x\" (x is the index of last item in the array, if current array length is 3, then x is 3).</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.push(item)",
                        "parameters": [
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "array item"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "hm(\"items\", [1, 2, 3]);\n  \nhm(\"items\").handle(\"afterCreate.1\", function (e) {\n    hm.log(\"item '\" + e.proposed + \"' is created at path '\" + e.originalPublisher.path + \"'\");\n  });\n \nhm(\"items\").push(4);\nhm.log(\"the last item is \" + hm(\"items\").last());\n  ",
                        "url": "http://jsbin.com/ajupaq/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "pushRange",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.pushRange(items)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.pushRange(items)",
                "returns": "node",
                "shortDesc": "push a set of items one by one into array node",
                "desc": "This method will raise multiple afterCreate event depending how many of items are being pushed.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.pushRange(items)",
                        "parameters": [
                            {
                                "name": "items",
                                "type": "Array",
                                "desc": "a set of items"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": " hm(\"items\", [1, 2, 3]);\n  \n hm(\"items\").handle(\"afterCreate.1\", function (e) {\n    hm.log(\"pushing item \" + e.proposed);\n });\n  \n  hm(\"items\").pushRange([4, 5]);\n  \n  hm.log(hm(\"items\").get());",
                        "url": "http://jsbin.com/iyabob/3",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "pushUnique",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.pushUnique(item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.pushUnique(item)",
                "returns": "node",
                "shortDesc": "push an item into an array node if it does not exists in the array",
                "desc": "This might trigger and \"afterCreate\" event",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.pushUnique(item)",
                        "parameters": [
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "an object to be pushed into the array node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": " var items = hm(\"items\", [1, 2, 3]);\n  \n  items.handle(\"*\", function (e) {\n    hm.log(\"event: \" + e.type  + \" triggered, at path: \" + e.originalPublisher.path + \" value: \" + e.proposed);\n  });\n  \n  items.pushUnique(1); //this will not trigger event\n  \n  items.pushUnique(4);",
                        "url": "http://jsbin.com/uyepez/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "pop",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.pop()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.pop()",
                "returns": "object",
                "shortDesc": "remove the item from tail of an array node, and return the item",
                "desc": "This make trigger \"beforeDel\" and \"afterDel\" event.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "navgiator.pop()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": " var items = hm(\"items\", [1, 2, 3]);\n  \n  items.handle(\"*\", function (e) {\n    hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", removing item \" + e.removed);\n  });\n  \n  var item = items.pop();",
                        "url": "http://jsbin.com/akisak/4",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "invoke",
        "type": "",
        "namespace": "Core.Repository.Node.Manipulation",
        "shortDesc": "invoke",
        "longDesc": "Node.set is one way to call a function node in repository. The \"this\" variable in the function refer to the parent of the node. Another way is to use node.invoke, the  \"this\" variable in the function refer to the parent of raw object.",
        "signatures": [
            {
                "name": "node.invoke(methodName, [p1, [p2, ..]]",
                "returns": "object",
                "shortDesc": "call a function node in repository in the context of parent node.",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.invoke(methodName, [p1, [p2, ..]]",
                        "parameters": [
                            {
                                "name": "methodName",
                                "type": "string",
                                "desc": "the function name of the node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "This example compare the difference between calling a function use \"set\" method and \"invoke\" method.",
                        "code": "var person = hm(\"person\", {\n  firstName: \"John\",\n  lastName: \"Doe\",\n  changeName: function (firstName, lastName) {\n    this.set(\"firstName\", firstName);\n    this.set(\"lastName\", lastName);\n  },\n  directChangeName: function (firstName, lastName) {\n    this.firstName = firstName;\n    this.lastName = lastName;\n    person.trigger(\"nameChanged\");\n  }\n});\n\nperson.handle(\"*\", function (e) {\n   hm.log(\"event: \" + e.originalType + \" path: \" + e.originalPublisher.path);\n});\n  \nperson.set(\"changeName\", \"Jane\", \"Roe\");\n  \nperson.invoke(\"directChangeName\", \"Mark\", \"Moe\");",
                        "url": "http://jsbin.com/eyekes/3",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "shift",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.shift()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.shift()",
                "returns": "object",
                "shortDesc": "remove an item from the head of an array node. and return the value of the item.",
                "desc": "This will trigger \"beforeDel\" and \"afterDel\" event.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.shift()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", removing item \" + e.removed);\n});\n  \nvar item = items.shift();\nhm.log(item);\n  ",
                        "url": "http://jsbin.com/ogeyip/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "unshift",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.unshift(item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.unshift(item)",
                "returns": "node",
                "shortDesc": "prepend an item to an array node.",
                "desc": "This will trigger \"beforeCreate\" and \"afterCreate\" event",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.unshift(item)",
                        "parameters": [
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "the item be added to the array"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", removing item \" + e.removed);\n});\n  \nitems.unshift(4);\n  ",
                        "url": "http://jsbin.com/exoceh/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "insertAt",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.insertAt(index, item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.insertAt(index, item)",
                "returns": "node",
                "shortDesc": "insert an item to the array node",
                "desc": "This will trigger \"afterDel\" and \"beforeDel\" event",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.insertAt(index, item)",
                        "parameters": [
                            {
                                "name": "index",
                                "type": "number",
                                "desc": "the index in the array for the item to be inserted at"
                            },
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "the object to add to the array node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", value: \" + e.proposed);\n});\n  \nitems.insertAt(2, 4);\n  ",
                        "url": "http://jsbin.com/ifuwid/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "updateAt",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "hm.updateAt(index, item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "hm.updateAt(index, item)",
                "returns": "node",
                "shortDesc": "update an item in array node at at an index position",
                "desc": "<p>\nThis will trigger \"beforeUpdate\" and \"afterUpdate\" method\n</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.updateAt(index, item)",
                        "parameters": [
                            {
                                "name": "index",
                                "type": "number",
                                "desc": "the index in array node where an item should be updated at"
                            },
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "the new value to be updated with"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + e.proposed + \" old value: \" + e.removed);\n});\n  \nitems.updateAt(1, 4);",
                        "url": "http://jsbin.com/aserux/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "removeAt",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.removeAt(index)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.removeAt(index)",
                "returns": "object",
                "shortDesc": "remove the item at the index in an array node",
                "desc": "<p>\nThis will trigger \"beforeDel\" and \"afterDel\" event\n</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.removeAt(index)",
                        "parameters": [
                            {
                                "name": "index",
                                "type": "number",
                                "desc": "the index of item to be removed from array node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + e.proposed + \" old value: \" + e.removed);\n});\n  \nitems.removeAt(1);",
                        "url": "http://jsbin.com/ohiqeq/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "move",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.move(fromIndex, toIndex)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.move(fromIndex, toIndex)",
                "returns": "node",
                "shortDesc": "move a item in an array from one slot to another slot",
                "desc": "<p>What the method does is to delete an item at a index, and create an item at a new index. This will trigger events like \"beforeDel\", \"afterDel\", \"beforeCreate\", \"afterCreate\", and \"move\". \n</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.move(fromIndex, toIndex)",
                        "parameters": [
                            {
                                "name": "fromIndex",
                                "type": "number",
                                "desc": "the index of the item to be moved"
                            },
                            {
                                "name": "toIndex",
                                "type": "number",
                                "desc": "the new index of the item to be moved to"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + e.proposed + \" old value: \" + e.removed);\n});\n  \nitems.move(0, 2);",
                        "url": "http://jsbin.com/icoqib/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "replaceItem",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.replaceItem(oldItem, newItem)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.replaceItem(oldItem, newItem)",
                "returns": "node",
                "shortDesc": "This will find the old item in a array node, and replace it with a new item. If the old item is not found, no change will be make",
                "desc": "<p>This will trigger \"beforeUpdate\" and \"afterUpdate\".</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.replaceItem(oldItem, newItem)",
                        "parameters": [
                            {
                                "name": "oldItem",
                                "type": "object",
                                "desc": "the item to be updated in array"
                            },
                            {
                                "name": "newItem",
                                "type": "object",
                                "desc": "the new item to updated to."
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + e.proposed + \" old value: \" + e.removed);\n});\n  \nitems.replaceItem(3, 4);",
                        "url": "http://jsbin.com/icakon/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "removeItem",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.removeItem(item)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.removeItem(item)",
                "returns": "node",
                "shortDesc": "find an item in an array node, and delete it. If item is not found, no change will be made.",
                "desc": "<p>This may trigger \"beforeDel\" and \"afterDel\"</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.removeItem(item)",
                        "parameters": [
                            {
                                "name": "item",
                                "type": "object",
                                "desc": "the item to be remove"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + e.proposed + \" old value: \" + e.removed);\n});\n  \nitems.removeItem(3);",
                        "url": "http://jsbin.com/ugized/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "removeItems",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.removeItems(items)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.removeItems(items)",
                "returns": "node",
                "shortDesc": "This remove a set of items from the array.",
                "desc": "<p>This may trigger a series of \"beforeDel\" and \"afterDel\"</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.removeItems(items)",
                        "parameters": [
                            {
                                "name": "items",
                                "type": "Array",
                                "desc": "an array of items to be removed from an array node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + e.proposed + \" old value: \" + e.removed);\n});\n  \nitems.removeItems([1, 3]);",
                        "url": "http://jsbin.com/obovif/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "clear",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.clear()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.clear()",
                "returns": "node",
                "shortDesc": "remove all item in a array node",
                "desc": "<p>This will remove all items in the array, and trigger \"afterCreate\" event.</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.clear()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n  \nitems.handle(\"*\", function (e) {\n  hm.log(\"event: \" + e.originalType + \" triggered at path: \" + e.originalPublisher.path + \", new value: \" + JSON.stringify(e.proposed) + \" old value: \" + JSON.stringify(e.removed));\n});\n  \nitems.clear();\n  ",
                        "url": "http://jsbin.com/opotaz/3",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "count",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.count()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.count()",
                "returns": "number",
                "shortDesc": "return the count of items in array node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.count()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\nhm.log(items.count());\n",
                        "url": "http://jsbin.com/ahocor/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "filter",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.filter(fn)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.filter(fn)",
                "returns": "array",
                "shortDesc": "filter the items in an array node, return the filtered result",
                "desc": "<p>\nThe function is like\n</p>\n\n<pre data-sub=\"prettyprint:.\">\nfunction (index, item) {\n  //return true or false;\n}\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.filter(fn)",
                        "parameters": [
                            {
                                "name": "fn",
                                "type": "Function",
                                "desc": "filtered function"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var items = hm(\"items\", [1, 12, 2, 3, 7, 6]);\n\nvar over3Items = items.filter(function (index, item) {\n    return (item > 3);\n});\n\nhm.log(JSON.stringify(over3Items));\n",
                        "url": "http://jsbin.com/aqicuh/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "each",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.each(fn)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.each(fn)",
                "returns": "node",
                "shortDesc": "process each items in an array node with a function",
                "desc": "<p>The function is like: </p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (index, currentNode, parentNode) {\n  //this == currentNode\n  //parentNode.path == currentNode.parent().path\n  //process item like\n  // this.set(this.get()*2);\n   //or\n   //this.del();\n}\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.each(fn)",
                        "parameters": [
                            {
                                "name": "fn",
                                "type": "Function",
                                "desc": "the process function"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following update each items individually, each update will trigger its own events.",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n\nitems.handle(\"*\", function (e) {\n  hm.log(\"node: \" + e.originalPublisher.path  + \" event: \" + e.originalType);\n});\n  \nitems.each(function (index, currentNode, parentNode) {\n  this.set(this.get()*2);\n});\n  ",
                        "url": "http://jsbin.com/abobox/3",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "node.each(directAccess, fn)",
                "returns": "node",
                "shortDesc": "process the items in array in a function, where you change the items directly, so that no event will be triggered for each item",
                "desc": "<p>You can improve the efficiency by process item directly. For example, instead of updating each item individually, you can batch update the items. The function is like:</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (index, item, items) {\n  //process items, such as items[index] = item * 2;\n  //return true if you have change the item, and afterUpdate \n  //event will be trigger for array node\n  //return false when you want to stop processing in remaining item\n  //otherwise, return undefined\n});\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.each(directAccess, fn)",
                        "parameters": [
                            {
                                "name": "directAccess",
                                "type": "Boolean",
                                "desc": "true if the fn process the item directly, otherwise false"
                            },
                            {
                                "name": "fn",
                                "type": "Function",
                                "desc": "the process function"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The follow batch update the items, only one event is triggered.",
                        "code": "var items = hm(\"items\", [1, 2, 3]);\n\nitems.handle(\"*\", function (e) {\n  hm.log(\"node: \" + e.originalPublisher.path  + \" event: \" + e.originalType);\n});\n  \nitems.each(true, function (index, item, items) {\n  items[index] = item * 2;\n  return true;\n});\n",
                        "url": "http://jsbin.com/ukimax/3",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "sort",
        "type": "",
        "namespace": "Core.Repository.Node.Array methods",
        "shortDesc": "node.sort()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.sort()",
                "returns": "node",
                "shortDesc": "sort an array node",
                "desc": "<p>\nThis method can sort the items (either object or primitive type). The method call will trigger \"afterUpdate\" event on the array items.\n</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.sort([asc])",
                        "parameters": [
                            {
                                "name": "asc",
                                "type": "boolean",
                                "desc": "true of sort by asc, otherwise false. The default is true"
                            }
                        ]
                    },
                    {
                        "versionAdded": "0.1",
                        "name": "node.sort(propertyName[, asc])",
                        "parameters": [
                            {
                                "name": "propertyName",
                                "type": "string",
                                "desc": "the name of a property of item object"
                            },
                            {
                                "name": "asc",
                                "type": "boolean",
                                "desc": "true of sort by asc, otherwise false. The default is true"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following sort a array of simple type, such as number",
                        "code": "var items = hm(\"items\", [5, 2, 9, 4, 2, 7]);\n\n\nitems.handle(\"*\", function (e) {\n  hm.log(\"node: \" + e.originalPublisher.path  + \" event: \" + e.originalType + \" value: \" + e.publisher.getJson());\n});\n\nhm.log(\"--sorting primitive number---\", \"red\");  \nitems.sort(); //by default sort by asc\nitems.sort(false);  \n  \n  var objItems = hm(\"objItems\", [\n    { id: 5, name: \"John\" },\n    { id: 2, name: \"Tom\" },\n    { id: 9, name: \"Amy\" },\n    { id: 4, name: \"Zoe\" }\n  ]);\n\nobjItems.handle(\"*\", function (e) {\n  hm.log(\"node: \" + e.originalPublisher.path  + \" event: \" + e.originalType + \" value: \" + e.publisher.getJson());\n});\n\nhm.log(\"--sorting objects---\", \"red\");\nobjItems.sort(\"id\");  \nobjItems.sort(\"id\", false); \nobjItems.sort(\"name\");  \nobjItems.sort(\"name\", false);",
                        "url": "http://jsbin.com/ucopuc/4",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "Utilities",
        "type": "",
        "namespace": "Core.Repository.Node",
        "shortDesc": "Utilities",
        "longDesc": "",
        "signatures": []
    },
    {
        "name": "isEmpty",
        "type": "",
        "namespace": "Core.Repository.Node.Utilities",
        "shortDesc": "node.isEmpty()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.isEmpty([subPath])",
                "returns": "Boolean",
                "shortDesc": "check if the value of the node is emtpy",
                "desc": "If the node does not exists, or its value is undefined, false, empty string, it will return true, otherwise false",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.isEmpty([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "  hm.log(hm().isEmpty(\"unExistNode\"));\n  //\n  hm(\"emptyString\", \"\");\n  hm.log(hm(\"emptyString\").isEmpty());\n  //\n  hm(\"booleanValue\", false);\n  hm.log(hm(\"booleanValue\").isEmpty());\n  //\n  hm.set(\"undefinedValue\", undefined);\n  hm.log(hm(\"undefinedValue\").isEmpty());",
                        "url": "http://jsbin.com/ekivep/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "isShadow",
        "type": "",
        "namespace": "Core.Repository.Node.Utilities",
        "shortDesc": "node.isShadow()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.isShadow()",
                "returns": "Boolean",
                "shortDesc": "determine if the node is a shadow object.",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.isShadow()",
                        "parameters": []
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "  var notShadow = hm(\"test\", {});\n  hm.log(notShadow.isShadow());\n  //\n  var shadow = notShadow.cd(\"*\");\n  hm.log(shadow.isShadow());",
                        "url": "http://jsbin.com/oyomij/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "toJSON",
        "type": "",
        "namespace": "Core.Repository.Node.Utilities",
        "shortDesc": "node.toJSON([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.toJSON([subPath])",
                "returns": "String",
                "shortDesc": "return JSON format for the value of the node",
                "desc": "<p>This is shortcut to JSON.stringify( this.get( subPath ) )</p>",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "compare",
        "type": "",
        "namespace": "Core.Repository.Node.Utilities",
        "shortDesc": "node.compare(expression)",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.compare([expression])",
                "returns": "Boolean",
                "shortDesc": "compare the value of the node with an optional expression",
                "desc": "<p>If the expression is missing, be behave like node.isEmpty(). If the expression is string, it will try to convert the string into a typed object then compare whether they are equal. You can also specify operator in the expression. </p>\n",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.compare([expression])",
                        "parameters": [
                            {
                                "name": "expression",
                                "type": "object",
                                "desc": "optional expression to be compared"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var number = hm(\"number\", 5);\nvar string = hm(\"string\", \"abc\");\n\nhm.log(\"--the following return true --\", \"red\");\n//\n//behave like noexistNode.isEmpty()\nhm.log(hm(\"noexistNode\").compare());\n//use \"==\"\nhm.log(number.compare(5));\nhm.log(number.compare('5'));\nhm.log(string.compare(\"abc\"));\n//use eval\nhm.log(number.compare(\">3\"));\nhm.log(number.compare(\"==4+1\"));\nhm.log(number.compare(\"==5\"));\nhm.log(number.compare(\"=='5'\"));\nhm.log(string.compare(\"=='abc'\"));\n//\nhm.log(\"--the following return false --\", \"red\");\n//\n//behave like number.isEmpty()\nhm.log(number.compare()); \nhm.log(string.compare());\n//use \"==\"\nhm.log(number.compare(\"abc\"));\nhm.log(number.compare(7));\nhm.log(number.compare(\"7\"));\nhm.log(string.compare(\"abd\"));\n//use eval\nhm.log(number.compare(\"==='5'\"));\nhm.log(string.compare(\"=='abd'\"));\nhm.log(number.compare(\"4+1\"));",
                        "url": "http://jsbin.com/epedab/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "LocalStorage",
        "type": "",
        "namespace": "Core.Repository.Node",
        "shortDesc": "LocalStorage",
        "longDesc": "<p>In this category, there are a couple of method that help to save data in repository to local storage,and restore them from local storage. Here some example.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ujowoh/2\">\nvar person = hm(\"person\", {\n  firstName: \"John\",\n  lastName: \"Doe\"\n});\n\n\nhm.log(\"initially there is no data in local storage\", \"red\");\nhm.log(JSON.stringify(person.getLocal()));\n\nhm.log(\"save the node to localStorage\", \"red\");\nperson.saveLocal();\nhm.log(\"retrieve it from localStorage\", \"red\");\nhm.log(JSON.stringify(person.getLocal()));\n\nhm.log(\"del the node\", \"red\");\nperson.del();\nhm.log(\"now the node is empty\", \"red\");\nhm.log(person.toJSON());\n\nhm.log(\"restore the node from local storage\", \"red\");\nperson.restoreLocal();\nhm.log(\"now the node is restored\");\nhm.log(person.toJSON());\n\nhm.log(\"clear the storage\", \"red\");\nperson.clearLocal();\n\nhm.log(\"now the local storage is gone\", \"red\");\nhm.log(JSON.stringify(person.getLocal()));\n</pre>",
        "signatures": []
    },
    {
        "name": "saveLocal",
        "type": "",
        "namespace": "Core.Repository.Node.LocalStorage",
        "shortDesc": "node.saveLocal([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.saveLocal([subPath])",
                "returns": "node",
                "shortDesc": "save the node value to localStorage in browser",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.saveLocal([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "getLocal",
        "type": "",
        "namespace": "Core.Repository.Node.LocalStorage",
        "shortDesc": "node.getLocal([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.getLocal([subPath])",
                "returns": "object",
                "shortDesc": "get the data from local storage of browser for the node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.getLocal([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "restoreLocal",
        "type": "",
        "namespace": "Core.Repository.Node.LocalStorage",
        "shortDesc": "node.restoreLocal([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.restoreLocal([subPath])",
                "returns": "node",
                "shortDesc": "restore the data in local storage in browser to the the node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.restoreLocal([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "clearLocal",
        "type": "",
        "namespace": "Core.Repository.Node.LocalStorage",
        "shortDesc": "node.clearLocal([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.clearLocal([subPath])",
                "returns": "node",
                "shortDesc": "remove the data in local storage of the node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.clearLocal([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "Repostiory Event",
        "type": "",
        "namespace": "Core.Unified Subscription",
        "shortDesc": "Repository Event",
        "longDesc": "<p>\nThe repository events are triggered during node manipulation with node.  They can be propagated vertically from bottom to top in repository, this is called event bubbling. They can also be cascaded from horizontally in repository, this is called event cascading.\n</p>",
        "signatures": []
    },
    {
        "name": "Event Bubbling",
        "type": "",
        "namespace": "Core.Unified Subscription.Repostiory Event",
        "shortDesc": "Event Bubbling",
        "longDesc": "<p>When a repository node trigger an event, the event can be bubbled up to its parents, until reach the root of repository. The following is an example.\n</p>\n\n<pre  data-sub=\"prettyprint:_; preview:.|http://jsbin.com/afemux/3\">\n  var person = hm(\"person\", {\n    firstName: \"Jone\",\n    lastName: \"Doe\",\n    phones: [\n      { number: \"444-4444\", type: \"home\" },\n      { number: \"888-8888\", type: \"cell\" }\n    ]\n  });\n  \n  //bind a handler to the person node, which can handle \n  //all the events of itself and its sub-nodes\n  person.handle(\"*\", function (e) {\n    hm.log(\"e.type: \" + e.type + \", e.orginalType: \" + e.originalType + \"e.publisher.path: \" + e.publisher.path + \", e.originalPublisher.path: \" + e.originalPublisher.path);\n  });\n  \n  hm.log(\"--event triggered inside of node method--\", \"red\");\n  //person.set(\"firstName\", \"Jane\");\n  person.set(\"phones.0.number\", \"333-3333\");\n  \n  hm.log(\"--explicitly trigger custom events --\", \"red\");\n  person.cd(\"phones.1.number\").trigger(\"myEvent\");\n</pre>\n\n\n",
        "signatures": []
    },
    {
        "name": "Event Cascading",
        "type": "",
        "namespace": "Core.Unified Subscription.Repostiory Event",
        "shortDesc": "Event Cascading",
        "longDesc": "<p>When a node trigger an event, and the node is referenced by another node,  this event will be triggered to that node, this is called event cascading. In the following example, the \"fullName\" node is a function. When the person node is added to the repository, Harmony automatically infer that \"fullName\" node references \"firstName\" node and \"lastName\" by parsing the source code of the function.  When \"firstName\" or \"lastName\" triggers an event, this event will be cascaded to the \"fullName\" node. \n</p>\n\n<pre  data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uwupus/3\">\n  var person = hm(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    fullName: function () {\n      return this.get(\"firstName\") + \",\" + this.get(\"lastName\"); \n    }\n  });\n  \n  //handler bind to fullName node\n  person.cd(\"fullName\").handle(\"afterUpdate\", function (e) {\n    hm.log(\"fullName is changed caused by \" + e.originalPublisher.path + \" and is now \" + e.publisher.get());\n  });\n  \n  person.set(\"firstName\", \"Jane\");\n \n</pre>\n\n<p>\nHarmony also support event bubbling and cascading at the same time. In the following the event cascade from \"firstName\" node to \"fullName\" node, and bubble up from \"fullName\" node to \"person\" node. The event handler is attached person node, and it can handle \"afterUpdate\" event of its children.\n</p>\n\n<pre  data-sub=\"prettyprint:_;preview:_|http://jsbin.com/agofor/2\">\n var person = hm(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    fullName: function () {\n      return this.get(\"firstName\") + \",\" + this.get(\"lastName\"); \n    }\n  });\n  \n  //handler bind to person node\n  person.handle(\"afterUpdate.*\", function (e) {\n    hm.log(\"original publisher \" + e.originalPublisher.path + \" and its value is \" + e.originalPublisher.get());\n  });\n  \n \n  //event trigger on \"firstName\"\n  person.set(\"firstName\", \"Jane\");\n</pre>\n\n",
        "signatures": []
    },
    {
        "name": "catch-all event *",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription",
        "shortDesc": "catch-all event *",
        "longDesc": "<p>Normally, when we want to capture a event, we use the exact name of the event, like the following, \"click\" and \"dblclick\" is the exact name of the events.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n$(\"#button\").bind(\"click dblclick\", function () { });\n</pre>\n\n<p>\nIn repository event, we can use wildcard character \"*\" to capture multiple events. For example\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uxupub/1\">\n var person = hm(\"person\", {\n    firstName: \"Jone\",\n    lastName: \"Doe\",\n    fullName: function () {\n      return this.get(\"firstName\") + \",\" + this.get(\"lastName\");\n    },\n    phones: [\n      { number: \"444-4444\", type: \"home\" },\n      { number: \"888-8888\", type: \"cell\" }\n    ]\n  });\n  \n  //bind a handler to the person node, which can handle \n  //all the events of itself and its sub-nodes\n  person.handle(\"*\", function (e) {\n    hm.log(\n      \"type: \" + e.type + \n      \", orginal type: \" + e.originalType + \n      \", path: \" + e.publisher.path + \n      \", original path: \" + e.originalPublisher.path + \n      \", original value: \" + e.originalPublisher.get()\n      );\n  });\n  \n  \n  person.set(\"firstName\", \"Jane\");\n  person.set(\"phones.0.number\", \"333-3333\");\n  person.cd(\"phones.1.number\").trigger(\"myEvent\");\n</pre>\n\n<p>\nThe match pattern of \"*\" event name is same as the pattern in matching file names in DOS. The following shows the match pattern.\n</p>\n<table>\n<col width=\"120px\">\n\t\t<tbody><tr>\n\t\t\t<td>Match pattern</td>\n\t\t\t<td>Event matched</td>\n\t\t\t<td>Event not matched</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>*</td>\n\t\t\t<td>all events of the node, and its descendant</td>\n\t\t\t<td>none(see remark below)</td>\n\t\t</tr>\n\t        <tr>\n\t\t\t<td>after*</td>\n\t\t\t<td>afterUpdate, afterUpdate.1, afterCreate, afterCreate.1</td>\n\t\t\t<td>beforeDel</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>after*.</td>\n\t\t\t<td>afterUpdate, afterCreate, afterDel</td>\n\t\t\t<td>afterUpdate.1, beforeUpdate</td>\n\t\t</tr>\n\n\t\t<tr>\n\t\t\t<td>afterUpdate*</td>\n\t\t\t<td>afterUpdate , afterUpdate.1, afterUpdate.2</td>\n\t\t\t<td>beforeUpdate</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>afterUpdate.*</td>\n\t\t\t<td>afterUpdate.1, afterUpdate.2</td>\n\t\t\t<td>afterUpdate , beforeUpdate</td>\n\t\t</tr>\n\t\n\t\t<tr>\n\t\t\t<td>afterUpdate</td>\n\t\t\t<td>afterUpdate</td>\n\t\t\t<td>every event other than \"afterUpdate\"</td>\n\t\t</tr>\n\t</tbody></table>\n\n<p>\n\"init\" is the only event which \"*\" can not capture, it has to be explicitly captured\n</p>",
        "signatures": []
    },
    {
        "name": "Subscription",
        "type": "",
        "namespace": "Core.Unified Subscription",
        "shortDesc": "Subscription",
        "longDesc": "<p>Harmony use subscription to handle for DOM event and repository event via the same API, same interface.  The original jQuery event implementation is 100% not changed,  Harmony change the way to consume jQuery event, so that subscription is unified.\n</p>\n\n<p>\nHandling repository event is special in that you can capture a different kinds of events by using wide card character \"*\" in event name.\n</p>\n\n<p>\nThere are two ways to leverage event in Harmony, event binding, and event subscription. Technically, event binding and event subscription are of no difference in Harmony. The difference lies on syntax and semantics. In event binding, there is no explicit subscriber, while the subscriber is always present in subscription. Harmony use subscription in most case.\n<p>\n\n<p>\nBoth case require a handler to handle the event. A event handler in harmony is  implemented as a workflow object internally, which can be expressed in different forms, depending on what circumstance it is used. There are forms, function, string, object.\n</p>",
        "signatures": []
    },
    {
        "name": "init event",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription",
        "shortDesc": "init event",
        "longDesc": "<p>\"init\" event is special event, it works for both for repository node and jQuery object. When an object subscribe an \"init\" event, the \"init\" event will be self triggered immediately, which means the handler will be invoke immediately. And this event will be triggered once, and it will be ignored even you manually trigger the event.  The following example, shows the difference between \"afterUpdate\" and \"init afterUpdate\" event.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/igokus/1\">\nvar time = hm(\"time\", new Date());\n\ntime.sub(\"$#updateTime\", \"click\", function (e) {\n  this.set(new Date());\n});\n\n//showTime1 does not subcribe init event, \n//so initially, showTime1 is blank\n$(\"#showTime1\").sub(time, \"afterUpdate\", function (e) {\n  this.text(e.publisher.get());\n});\n\n//showTime2 subcribe init event, \n//so initially, showTime2 has a time stamp\n$(\"#showTime2\").sub(time, \"init afterUpdate\", function (e) {\n  this.text(e.publisher.get());\n});\n</pre>",
        "signatures": []
    },
    {
        "name": "Event Subscription",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription",
        "shortDesc": "Event Subscription",
        "longDesc": "<p>Event Subscription refers to process that an object  subscribe certain events of another object with a handler. When these events triggered, handler will be executed.  A subscription consist of four elements.</p>\n<ol>\n<li>subscriber</li>\n<li>publisher</li>\n<li>publisher's event names</li>\n<li>handler</li>\n</ol>\n\n<p>The subscriber and publisher can either model (repository node) or  view (jQuery object). These means Harmony  support  four possible combinations between them, model subscribe model, model subscribe view, view subscribe model, view subscribe view. In side the handler, \"this\" refer to subscriber.</p>\n",
        "signatures": [
            {
                "name": "hm.sub()",
                "returns": "hm",
                "shortDesc": "create a subscription between a publisher, and subscriber",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.sub(subscriber, publisher, eventTypes[, handler[, handlerOptions[, delegateSelector]]])",
                        "parameters": [
                            {
                                "name": "subscriber",
                                "type": "string, DOM element, jQuery object, or Node",
                                "desc": "the object subscribe the event, It can be null, \"_\", \"null\", meaning that there is no subscriber."
                            },
                            {
                                "name": "publisher",
                                "type": "string, DOM element,  jQuery object or repository node",
                                "desc": "the object which publish event"
                            },
                            {
                                "name": "eventTypes",
                                "type": "string",
                                "desc": "event names separated by string"
                            },
                            {
                                "name": "handler",
                                "type": "string, function, object",
                                "desc": "optional handler which will be executed when event trigger, it is optional when the subscriber it is a handler function"
                            },
                            {
                                "name": "handlerOptions",
                                "type": "object",
                                "desc": "optional options to initialize a instance of handler"
                            },
                            {
                                "name": "delegateSelector",
                                "type": "string",
                                "desc": "optional delegate selector to enable jQuery delegate event"
                            }
                        ]
                    }
                ],
                "examples": []
            },
            {
                "name": "subscriber.sub()",
                "returns": "subscriber",
                "shortDesc": "a subscriber subscribe events from an other object, the subscriber is either a jQuery object or a repository node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "subscriber.sub(publisher, events[, handler[, handlerOptions [, delegateSelector]]])",
                        "parameters": [
                            {
                                "name": "publisher",
                                "type": "string, DOM object, jQuery object, or repository node",
                                "desc": "the object that publish event"
                            },
                            {
                                "name": "events",
                                "type": "string",
                                "desc": "event names separated by string"
                            },
                            {
                                "name": "handler",
                                "type": "string, function, object",
                                "desc": "optional handler which will be executed when event trigger, it is optional when the subscriber it is a handler function"
                            },
                            {
                                "name": "handlerOptions",
                                "type": "object",
                                "desc": "optional object to initialize an special instance of a handler"
                            },
                            {
                                "name": "delegateSelector",
                                "type": "string",
                                "desc": "optional delegateSelector to enable jQuery delegate event"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "var myapp = hm(\"myapp\", {\n  message: \"hello\",\n  time: null,\n  color: null,\n  setTime: function (e) {\n    //\"this\" == e.subscriber (myapp.setTime)\n    //and it should not be called using node.set or node.invoke\n    e.subscriber.set(\"..time\", new Date());\n  }\n});\n\n//model subcribe view event with a handler in string form\nmyapp.cd(\"message\").sub(\"$#btn1\", \"click\", \"*alert\");\n\n//model subscribe view event no handler\n//because the subscriber is the handler\nmyapp.cd(\"setTime\").sub(\"$#btn2\", \"click\");\n\n//view subscribe model event with a handler in string form\n$(\"#showTime\").sub(myapp.cd(\"time\"), \"afterUpdate\", \"text\");\n\n//model subscribe view event a handler in string form, with a delegate selector\nmyapp.cd(\"color\").sub(\"$#controlPanel\", \"click\", \"val\", null, \".color\");\n\n//view subscribe model event a handler in string form\n$(\"#controlPanel\").sub(myapp.cd(\"color\"), \"afterUpdate\", \"css*background-color\");\n",
                        "url": "http://jsbin.com/ocemal/7",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "Event Binding",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription",
        "shortDesc": "Event Binding",
        "longDesc": "<p>Event binding special case of event subscription, where the subscriber is missing. The \"this\" in the handler will be the global object in ES3, or null in ES5.</p>",
        "signatures": [
            {
                "name": "hm.handle()",
                "returns": "hm",
                "shortDesc": "bind a handler to events of publisher, which is either a jQuery object or node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.handle(publisher, eventTypes,  handler,  [handlerOptions, [delegateSelector]])",
                        "parameters": [
                            {
                                "name": "publisher",
                                "type": "string, jQuery object, node",
                                "desc": "The object which triggers the event"
                            },
                            {
                                "name": "eventTypes",
                                "type": "string",
                                "desc": "combination of event names separated by space"
                            },
                            {
                                "name": "handler",
                                "type": "string, object, function",
                                "desc": "handler to handle the event"
                            },
                            {
                                "name": "handlerOptions",
                                "type": "string, object",
                                "desc": "optional options to initialize a handler instance"
                            },
                            {
                                "name": "delegateSelector",
                                "type": "string",
                                "desc": "a selector used in jQuery delegate event"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following example use various forms of parameter, and comments describe how these parameters are used.",
                        "code": "//use \"$\" jquery selector as publisher\n//use handler in string form  \n//use options \"hello\" to intialize an instance of \"*alert\" workflow\nhm.handle(\"$#btn1\", \"click\", \"*alert\", \"hello\");\n\n\n//use DOM element as publisher\n//use handler in function form  \nhm.handle( document.getElementById(\"btn2\"), \"click\", function (e) {\n   hm(\"time\", new Date());\n});\n\n//use string selector of repository node as publisher\n//use wildcarded repository event\nhm.handle(\"time\", \"after*\", function (e) {\n  $(\"#showTime\").text(e.publisher.get());\n});\n\n//use \"$\" selector to select dom nodes as publisher\n//use handler in function form\n//use delegate selector to enable jQuery delegate event\nhm.handle(\"$#controlPanel\", \"click\", function (e) {\n  hm.set(\"color\", e.originalPublisher.val());\n}, null, \".color\");\n\n//use node as publisher\n//use wildcarded repository event\n//use handler in object form \nhm.handle( hm(\"color\"), \"after*\", \n  {\n    get: function (e) {\n     $(\"#controlPanel\").css(\"background-color\", e.publisher.get());\n    }\n  }\n);",
                        "url": "http://jsbin.com/osuzex/4",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "publisher.handle()",
                "returns": "jQuery object or Node",
                "shortDesc": "bind a handler to events of publisher, which is either a jQuery object or node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "publisher.handle(eventTypes, handler, [handlerOptions, [delegateSelector]])",
                        "parameters": [
                            {
                                "name": "eventTypes",
                                "type": "string",
                                "desc": "event names separated by space"
                            },
                            {
                                "name": "handler",
                                "type": "function, string, object",
                                "desc": "the handler to handle the event"
                            },
                            {
                                "name": "handlerOptions",
                                "type": "object",
                                "desc": "optional options to initialize an instance of workflow"
                            },
                            {
                                "name": "delegateSelector",
                                "type": "string",
                                "desc": "optional jQuery selector to enable delegate event"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "This is a refactory of above example, the difference is that \"hm.handle\" is changed to \"publisher.handle\"",
                        "code": "//use \"$\" jquery selector as publisher\n//use handler in string form  \n//use options \"hello\" to intialize an instance of \"*alert\" workflow\n$(\"#btn1\").handle(\"click\", \"*alert\", \"hello\");\n\n\n\n//use DOM element as publisher\n//use handler in function form  \n$(\"#btn2\").handle( \"click\", function (e) {\n   hm(\"time\", new Date());\n});\n\n//use string selector of repository node as publisher\n//use wildcarded repository event\nhm(\"time\").handle(\"after*\", function (e) {\n  $(\"#showTime\").text(e.publisher.get());\n});\n\n//use \"$\" selector to select dom nodes as publisher\n//use handler in function form\n//use delegate selector to enable jQuery delegate event\n$(\"#controlPanel\").handle( \"click\", function (e) {\n  hm.set(\"color\", e.originalPublisher.val());\n}, null, \".color\");\n\n//use node as publisher\n//use wildcarded repository event\n//use handler in object form \nhm(\"color\").handle( \"after*\", \n  {\n    get: function (e) {\n      $(\"#controlPanel\").css(\"background-color\", e.publisher.get());\n    }\n  }\n);",
                        "url": "http://jsbin.com/agisar/4",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "Handler",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription",
        "shortDesc": "Handler",
        "longDesc": "<p>A handler works the same way for both model or view. There are three forms of handler, object-formed,  function-formed, string-formed. The object-formed handler is the native form of handler. Function-formed handler and string-formed handler are syntax sugar of workflow object, they are more convenient to use and will be converted to object-formed handler when the subscription or event binding is created. \n</p>\n\n<p>The building block of handler is called activity, which is like one of the functions below. A handler consist of one or more activities.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (e) {\n  //this == e.subscriber\n}\n//or\nfunction (valueOfPreviousActivity, e) {\n    //this == e.subscriber\n}\n</pre>\n\n<h3>Difference activity functions and jQuery handler</h3>\n<p>\nInside these functions, <code>this</code> is equal to <code>e.subscriber</code>, which is the subscriber of the subscription. In the case of event binding, <code>this</code> and e.subscriber refer to the global object, <code>window</code>, or <code>null</code> in ES5 strict mode. In jQuery handler, the <code>this</code> object refer to e.currentTarget in jQuery event. \n</p>\n\n<p>\nIn jQuery handler, <code>return false</code>  is short-cut of <code>e.preventDefault</code> and <code>e.stopPropagation</code>. In activity functions, you can not use this shortcut, because the return value of an activity is used to feed the input of next activity. You have explicitly call <code>e.preventDefault</code> and <code>e.stopPropagation</code> in activity functions.\n</p>\n\n<h3>Common members of event Objects of model event and view event</h3>\n\n<p>Harmony normalize the event object for both jQuery event and repository event, so that have some common members like the following.\n</p>\n\n<table>\n\t\t<colgroup><col style=\"width:220px\">\n\t\t<col style=\"width:auto;\">\n\t\t<col style=\"width:220px\">\n\t\t</colgroup><tbody><tr>\n\t\t\t<td>event members<br>\n\t\t\t</td>\n\t\t\t<td>repository event (type of hm.Event)</td>\n\t\t\t<td>jQuery event (type of $.Event)</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>subscriber</td>\n\t\t\t<td colspan=\"2\">\n\t\t\t\ta repository node or a jQuery object\n\t\t\t</td>\n\n\t\t</tr>    \n\t\t<tr>\n\t\t\t<td>publisher</td>\n\t\t\t<td>\n\t\t\t\trepository node\n\t\t\t</td>\n\t\t\t<td>$(e.currentTarget)</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>originalPublisher</td>\n\t\t\t<td>\n\t\t\t\trepository node\n\t\t\t</td>\n\t\t\t<td>$(e.target)</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>workflow</td>\n\t\t\t<td>\n\t\t\t\tcurrent workflow object\n\t\t\t</td>\n\t\t\t<td>current workflow object</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>type</td>\n\t\t\t<td>\n\t\t\t\tstring, such as \"afterUpdate\"\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\tstring, such as \"click\"\n\t\t\t</td>\n\n\t\t</tr>\n\n\t\t<tr>\n\t\t\t<td>stopPropagation()</td>\n\t\t\t<td colspan=\"2\">\n\t\t\t\tPrevents other event handlers from being called.\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td>stopImmediatePropagation()</td>\n\t\t\t<td colspan=\"2\">\nPrevents the event from bubbling up the DOM tree or repository, preventing any parent handlers from being notified of the event.\n\t\t\t</td>\n\t\t</tr>\n<tr>\n<td>isPropagationStopped()</td>\n<td colspan=\"2\">Returns whether event.stopPropagation() was ever called on this event object.</td>\n</tr>\n\n<tr>\n<td>event.isImmediatePropagationStopped()</td>\n<td colspan=\"2\">Returns whether event.stopImmediatePropagation() was ever called on this event object.</td>\n</tr>\n\n\n\t</tbody></table>\n\n<h3>Specific members of event object of model event</h3>\n\n<p>But because the implementations of jQuery event and repository event are inherently different, the event objects of two type have their unique members as well. All the existing members of jQuery event are still present, the detailed reference is <a href=\"http://api.jquery.com/category/events/event-object/\">here</a>.  Repository event's own unique members are as following. \n</p>\n<dl>\n  <dt>originalType</dt>\n   <dd>Because repository event support event wildcard capture, the \"type\" property change when bubble, such as \"afterUpdate.1\", \"afterUpdate.2\",  however the originalType does not change, such as \"afterUpdate\".</dd>\n\n  <dt>isDepedent()</dt>\n   <dd>Repository event support event cascading, so firstName's event will cascade to fullName, in the event handler of fullName, the isDependen() will return true.</dd>\n\n<dt>stopCascade()</dt>\n<dd>If you call stopCascade() inside firstName's event handler, that even will not be cascade to fullName.</dd>\n\n<dt>isCascadeStopped()</td>\n<dd>It tells you whether the cascade is stop.</dd>\n\n<dt>level</dt>\n<dd>If a events of \"person\" node is bubbled from firstName, then it is level will be 1, this level will increment when it bubble up every level.</dd>\n\n<dt>error()</dt>\n\n<dd>Inside beforeCreate.* , beforeUpdate.*, beforeDel.* event handler, if you call this method,  the create, update, del method will stop operations.</dd>\n\n<dt>hasError()</dt>\n<dd>It will return true, if error() has called.</dd>\n\n</dl>\n",
        "signatures": []
    },
    {
        "name": "Declarative",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription",
        "shortDesc": "Declarative Subscription",
        "longDesc": "<p>Declarative subscriptions is the practice of creating subscriptions using the data-sub attribute of html element. This feature depends of <b>subscription group</b> object,  which contains the subscription data between an element and other objects. It can be created from a serialized string. The string can be embedded in data-sub attribute of an element. When page load, by default, Harmony will automatically, create an group object from the string, and use it to build the subscriptions for the element.</p>\n\n<p>The native form value of subscription group looks like the following: </p>\n\n<pre data-sub=\"prettyprint:_\">\n{                                                                   \n//the first six properties are specified in subscription text\n\tns: \"ns\",                                                          \n\tsub: [                                                             \n\t\t{ key: \"events\", value: \"value\" }                                 \n\t],                                                                 \n\tpub: [                                                             \n\t\t{ key: \"events\", value: \"value\" }                                 \n\t],                                                                 \n\tgroups: [                                                          \n\t\t{ key: \"groupName\", value: \"value\"}                               \n\t],                                                                 \n\toptions: \"group options\",                                                 \n\ttext: \"the original serialized string\",                                          \n\n//the following are shared over the group hierarchy, and are calculated.\n\telemGroup: elemGroup,   //the root group                                           \n\telem: elem,                                                        \n\tsubscriptions: [                                                   \n\t\t{                                                                 \n\t\t\tpublisher: publisher,                                            \n\t\t\teventTypes: eventTypes,                                          \n\t\t\tsubscriber: subscriber,                                          \n\t\t\thandler: handler,                                                \n\t\t\toptions: options,                                                \n\t\t\tdelegate: delegate                                               \n\t\t}                                                                 \n\t] ,\n        appendSub: function (subscriber, publisher, eventTypes, handler, options, delegate){}, \n       prependSub: function (subscriber, publisher, eventTypes, handler, options, delegate){}, \n       clearSubs: function (){}\n}                                                                                        \n</pre>\n\n<p>The string value is a group of properties separated by \";\". Each property has a property name and a property value. The following is an example:</a>\n\n<pre data-sub=\"prettyprint:_\">\npropertyName1:propertyValue2[;propertyName2:PropertyValue2[;propertyName3:propertyValue3]...]\n</pre>\n\n<p>There are 4 types of <b>subscription property</b>, <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Subscription+group.ns\">ns</a>, <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Subscription+group.!events\">!events</a>, <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Subscription+group.%24events\">$events</a>, and <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Subscription+group.Common+group\">common group</a>. All these properties are optional, but an element needs to have at least one subscription property to be called <b>subscription element</b>.\n</p>\n\n<h3>Debugging Subscription group</h3>\n\n<p>Subscription group heavily use <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Repository.Path\">path calculation</a> and <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Handler.string+expression\">string expression of handler</a>, read them before write a subscription group. \nHarmony comes with some debugging utilities. You can use them to print out a subscription group constructed  from a string. There are usually two ways to print, both require a <span class=\"code\">&lt;div data-sub=\"logPanel:_\"&gt;&lt;/div&gt;</span>. The following shows how to programmatically printout.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/oritak/2\">\n\nhm.printGroup(\"$click:count|*++;!init afterUpdate:color|css*background-color;text:firstName\");\n</pre>\n\n<p>\nIf you have subscription element, you can add a group <span class=\"code\">\"debug:_\"</span> to the group text of the element, the group object will be print out to the logPanel. The following is an example.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/agahoc/1\">\n  &lt;input type=\"text\" data-sub=\"val:name|keyup;debug:_\" /&gt;\n  &lt;div data-sub=\"dump:name;debug:_\"&gt;&lt;/div&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "Disable Inference",
        "type": "",
        "namespace": "Core.Unified Subscription.Repostiory Event.Event Cascading",
        "shortDesc": "Disable Inference",
        "longDesc": "<p>Most of time, this automatic dependencies inference works well, and it is desirable, because it is free. However, if you want to disable this automatic inference for whatever reason, you can do one of the following. \n</p>\n\n<p>\nGive the function node a name begin with \"_\" . In the following, the full name is named \"__\", so that the inferencing will be disabled.\n</p>\n<pre  data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ebadub/3\">\n  var person = hm(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    //name the function \"__' to disable automatic dependencies inferrence\n    fullName: function __ () {\n      return this.get(\"firstName\") + \",\" + this.get(\"lastName\"); \n    }\n  });\n  \n  var triggered = false;\n  //handler bind to fullName\n  person.cd(\"fullName\").handle(\"afterUpdate\", function (e) {\n    triggered = true;\n  });\n  \n  \n  if (triggered) {\n    hm.log(\"inferenc is enabled\");\n  } else {\n    hm.log(\"inferenc is disabled\");\n  }\n</pre>\n\n<p>\nYou can also assign \"this\" variable to variable  in function body. The following example make \"fullName\" node reference \"firstName\" but not \"lastName\".\n</p>\n\n<pre  data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ugawof/3\">\n   var person = hm(\"person\", {\n    firstName: \"John\",\n    lastName: \"Doe\",\n    //now the fullName reference firstName, but not lastName\n    fullName: function () {\n      var me = this;\n      return this.get(\"firstName\") + \",\" + me.get(\"lastName\"); \n    }\n  });\n  \n  //handler bind to fullName\n  person.cd(\"fullName\").handle(\"afterUpdate\", function (e) {\n    hm.log(e.originalPublisher.path  + \" cascade change to fullName, now it is \" + e.publisher.get());\n  });\n  \n \n  person.set(\"firstName\", \"Jane\");\n  person.set(\"lastName\", \"Roe\");\n</pre>\n",
        "signatures": []
    },
    {
        "name": "Explicit Reference",
        "type": "",
        "namespace": "Core.Unified Subscription.Repostiory Event.Event Cascading",
        "shortDesc": "Explicit Reference",
        "longDesc": "<p>The automatic inference depends of the usage of \"this.get(xxx)\" token, if your source codes does not have this token presence, you can do one of the following.\n</p>\n\n<p>\nYou can add source code to hint the Harmony about the reference. In the following example, some additional useless string is added as statement. These statements although is useless, but they will not removed by minifiers.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ixopeq/1\">\n  var rawPerson;\n  \n  var person = hm(\"person\", rawPerson = {\n    firstName: \"Jone\",\n    lastName: \"Doe\",\n    fullName: function () {\n      \"this.get('firstName')\";\n      \"this.get('lastName')\";\n      return rawPerson.firstName + \",\" + rawPerson.lastName;\n    }\n  });\n  \n  //handler bind to fullName\n  person.cd(\"fullName\").handle(\"afterUpdate\", function (e) {\n    hm.log(e.originalPublisher.path + \" cascade change to fullName, the current value is \" + e.publisher.get());\n  });\n  \n \n  person.set(\"firstName\", \"Jane\");\n  person.set(\"lastName\", \"Roe\");\n</pre>\n\n<p>\nAnother solution is you write code to explicitly to write code to specify the reference like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/isural/2\">\n  var rawPerson;\n  \n  var person = hm(\"person\", rawPerson = {\n    firstName: \"Jone\",\n    lastName: \"Doe\",\n    fullName: function __ () {\n      return rawPerson.firstName + \",\" + rawPerson.lastName;\n    }\n  });\n\n  //add references explicitly\n  person.cd(\"fullName\").reference(\n    person.getPath(\"firstName\"), \n    person.getPath(\"lastName\")\n  );\n  \n  \n  //handler bind to fullName\n  person.cd(\"fullName\").handle(\"afterUpdate\", function (e) {\n    hm.log(e.originalPublisher.path + \" cascade change to fullName, the current value is \" + e.publisher.get());\n  });\n  \n \n  person.set(\"firstName\", \"Jane\");\n  person.set(\"lastName\", \"Roe\");\n</pre>",
        "signatures": [
            {
                "name": "node.reference( targetPath1[, targetPath2, ...] )",
                "returns": "node",
                "shortDesc": "add reference to the current node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.reference( targetPath1[, targetPath2, ...] )",
                        "parameters": [
                            {
                                "name": "targetPath1",
                                "type": "string",
                                "desc": "the path of the node that current node will reference"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "object-formed",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler",
        "shortDesc": "object-formed handler",
        "longDesc": "<p>Each workflow object can have at most four activity functions:  \"get\", \"set\", \"convert\", \"finalize\".  They are executed in sequence when event is triggered. The result of one activity will be passed along to next activity. The following examples shows how to use workflow object as handler in a subscription. The two label subscribe the events of a button using the same workflow object. This object has all four activities. \n</p>\n\n<pre data-sub=\"prettyprint:_|;preview:_|http://jsbin.com/ozexuv/3\">\nvar workflowObject = {\n  \n  get: function (e) {\n    return new Date();\n  },\n  \n  convert: function (value, e) {\n   return value.getHours() + \":\" + \n     value.getMinutes() + \":\" + \n       value.getSeconds() + \".\" + \n         value.getMilliseconds(); \n  },\n\n  set: function (value, e) {\n    this.text(value);\n    \n  },\n  \n  finalize: function (value, e) {\n    \n    hm.log(\n      \"subscriber: \" + this[0].id + \n      \" update itself as publisher: \" + e.publisher[0].id +\n      \" fired event \" + e.type + \" at \" + value);\n    hm.log(e.workflow === workflowObject);\n  } \n};\n\n$(\"#lableOne\").sub(\"$#buttonOne\", \"click\", workflowObject);\n$(\"#lableTwo\").sub(\"$#buttonOne\", \"click\", workflowObject);\n</pre>\n\n",
        "signatures": []
    },
    {
        "name": "function-formed",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler",
        "shortDesc": "function-formed handler",
        "longDesc": "<p>If you want to put all the logics together, you can use a function handler. Internally, this function handler will be converted to workflow object with just a \"get\" activity which points to this function handler.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ucuxux/1\">\nvar functionHandler = function (e) {\n  \n  var value = new Date();\n  \n  value = value.getHours() + \":\" + \n     value.getMinutes() + \":\" + \n       value.getSeconds() + \".\" + \n         value.getMilliseconds(); \n  \n  this.text(value);\n  \n  hm.log(\n      \"subscriber: \" + this[0].id + \n      \" update itself as publisher: \" + e.publisher[0].id + \n      \" fired event \" + e.type + \" at \" + value);\n  \n  var workflow = e.workflow;\n  hm.log(\n    workflow.get == functionHandler && \n    workflow.set === undefined &&\n    workflow.convert === undefined &&\n    workflow.finalize === undefined\n  );\n};  \n\n$(\"#lableOne\").sub(\"$#buttonOne\", \"click\", functionHandler);\n$(\"#lableTwo\").sub(\"$#buttonOne\", \"click\", functionHandler); \n</pre>",
        "signatures": []
    },
    {
        "name": "string-formed",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler",
        "shortDesc": "string-formed handler",
        "longDesc": "<p>String expression is one form of handler.  When it is used in subscription, it will be convert to a workflow object. There are three formats of string expression, <b>activity expression,  node path expression, and workflow type expression</b>.</p>\n\n<h3>activity expression</h3>\n\n<p>Activity expression is combination of activity name separated by space. If one activity does not exist , and it is in the middle of the expression, use \"_\" to replace, it is at tail position, simply leave it out.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\ngetActivityName[, setActivityName[, convertActivityName[, finalizeActivityName] ]]\n</pre>\n\n<p>Below are a few example</p>\n\n<pre data-sub=\"prettyprint:_\">\n\"val set\"\n\"*getTextValue *setNodeValue\"\n\"val set *convertToNumber\"\n\"get html\"\n\"*getTextValue *setNodeValue _ *myFinalizer\" (convert is missing)\n</pre>\n\n<p>The following example is refactor of <a target=\"_blank\" href=\"http://jsbin.com/omaduh/1/edit\">this example</a> </p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ojukah/1\">\nvar model = hm(\"helloApp\", {\n    name: \"\",\n    message: function () {\n      var name = this.get(\"name\").trim();\n      return name ? \"Hello, \" + name : \"\";\n    },\n    color: \"\"\n });\n  \nmodel.cd(\"name\").sub($(\"#txt1\"), \"keyup\", \"val set\");\n  \n$(\"#label1\").sub(model.cd(\"message\"), \"afterUpdate\", \"get text\");\n  \nmodel.cd(\"color\").sub($(\"#color\"), \"keyup\", \"val set\");\n  \n$(\"#color\").sub(model.cd(\"color\"), \"afterUpdate\", \n\"get css*background-color\");\n</pre>\n<h4>Inference for \"*getMember\" and \"*setMember\" activity short-cut </h4>\n<p>If \"*getMember\" and \"*setMember\" activity short-cut is used in activity expression, and there is only one activity in the expression, this is not sufficient to build a workflow, Harmony can infer the missing activity. Here is the rule of inference,  the simple rule is to leave out the \"get\" or \"set\" short-cut for repository node, because it is by default.</p>\n<table>\n<tr><td>publisher</td><td>subscriber</td><td>current activity expression</td><td>inferred activity expression</td></tr>\n<tr>\n<td>repository node</td>\n<td>jQuery object</td>\n<td>val</td>\n<td>val set</td>\n</tr>\n<tr>\n<td>jQuery object</td>\n<td>repository node</td>\n<td>html</td>\n<td>get html</td>\n</tr>\n</table>\n<p>Bellow is refactory of above example</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/aqevak/1\">\n  /  var model = hm(\"helloApp\", {\n    name: \"\",\n    message: function () {\n      var name = this.get(\"name\").trim();\n      return name ? \"Hello, \" + name : \"\";\n    },\n    color: \"\"\n  });\n  \n  //get view set model is implicit, change from \"val set\" to \"val\"\n  model.cd(\"name\").sub($(\"#txt1\"), \"keyup\", \"val\");\n  \n  //get model set view is implicit, change from \"get text\" to \"text\"\n  $(\"#label1\").sub(model.cd(\"message\"), \"afterUpdate\", \"text\");\n  \n  //get view set model is implicit, change from \"val set\" to \"val\"\n  model.cd(\"color\").sub($(\"#color\"), \"keyup\", \"val\");\n  \n  //get model set view is implicity, \n  //change from \"get css*background-color\" to \"css*background-color\n  $(\"#color\").sub(model.cd(\"color\"), \"afterUpdate\", \"css*background-color\");\n</pre>\n\n<h3>\npath expression\n</h3>\n<p>Activity expression is good to compose a workflow with common activities. But if the handling logic is too special to compose,  we need to a ad-hoc <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Handler.function+handler\">function handler</a>. We can reference it directly in subscription, or we add the function into repository, and use path expression to reference function. The path expression starts with \"#\" sign. And the path is a sub-path relative the the subscriber if subscriber it is repository node, if subscriber is not repository node, and publisher is repository node, then sub-path is relative to publisher, else it is relative to root which is a absolute path. If absolute path works for you, you can use \"/\" to prefix that path.  Inside the handler, \"this\" is always refer the e.publisher, but since it is inside of the model, it may be confused to treated as parent node,  be avoid the confusion, you can use \"e.subscriber\" instead of \"this\". The following is example:</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/itoqaq/1\">\nvar separator = /\\s*,\\s*/;\n\nvar model = hm(\"myapp\", {\n  person: {\n    firstName: \"\",\n    lastName: \"\"\n  },\n  handlers: {\n    updatePerson: function (e) {\n      var fullName = $.trim(e.publisher.val());\n      parts = fullName.split(separator);\n      //\n      //here \"this\" refer to the subscriber,\n      //but not myapp.handlers\n      //to avoid the confusion, use e.subscriber instead\n      e.subscriber.set(\"firstName\", parts[0] || \"\");\n      e.subscriber.set(\"lastName\", parts[1] || \"\");\n    }\n  }\n});\nmodel.cd(\"person\").sub( $(\"#txtFullName\"), \"keyup\",\n                       \"#/myapp.handlers.updatePerson\");\n//here use \"#..handlers.updatePerson\" also works\n</pre>\n\n<h3>Workflow type expression</h3>\n<p>\nA workflow type is used create a workflow, as handler. You can reference workflow type with its name prefix with \"*\",  for example \"*workflowTypeName\". Some workflow types needs a initialize options like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nsubscriber.sub(publisher, eventNames, \"*workflowTypeNames\", initializeOptions);\n</pre>\n\n<p>Harmony comes with lots reusable workflow types,  for how to create your workflow types, refer <a href=\"tba\">this.</a>. The following is a few example of using built-in workflow types, such as \"*++\", \"*0\",  \n\"*enable\",  \"*show\"\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ozuton/4\">\n\n  var model = hm(\"clickCount\", 0);\n  \n  model.sub($(\"#addClick\"), \"click\", \"*++\");\n  \n  model.sub($(\"#reset\"), \"click\", \"*0\");\n  \n  $(\"#addClick\").sub(model, \"afterUpdate\", \"*enable\", \"&lt;3\");\n  \n  $(\"#clickCount\").sub(model, \"init afterUpdate\", \"text\");\n  \n  $(\"#warning\").sub(model, \"init afterUpdate\", \"*show\", \"&gt;=3\");\n</pre>\n",
        "signatures": []
    },
    {
        "name": "activity",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler",
        "shortDesc": "activity",
        "longDesc": "<p>Activities are building block of workflow. A workflow object can have at most four activities. The are executed by the order of \"get\", \"convert\", \"set\", \"finalize\". Additional to this activities, a workflow type can have one more activity. This activity is called to create a workflow object and it is called once. </p>\n\n<p>There are two kinds of activity, ad-hoc activity and and common activity, ad-hoc activity is a function, and common activity is also function, but it is referenced by a string key. The following are an example of ad-hoc activity.\n</p>\n\n<h3>ad-hoc activity</h3>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/oyubib/1\">\nvar model = hm(\"helloApp\", {\n  name: \"\",\n  message: function () {\n    var name = this.get(\"name\").trim();\n    return name ? \"Hello, \" + name : \"\";\n  }\n});\n\nmodel.cd(\"name\").sub($(\"#txt1\"), \"keyup\", {\n  get: function (e) {\n    return e.publisher.val();\n  },\n  set: function (value, e) {\n    this.set(value);\n  }\n});\n\n$(\"#label1\").sub(model.cd(\"message\"), \"afterUpdate\", {\n  get: function (e) {\n    return e.publisher.get();      \n  },\n  set: function (value, e) {\n    this.text(value);\n  }\n});\n</pre>\n\n<h3>Common activity</h3>\n<p>Common activity is more reusable than ad-hoc activity. To create them, we can put \"get\" activity under hm.activity.get object, \"set\" activity under hm.activity.set object, and do the same for \"convert\", \"finalize\" activity.  Then we reference them by name, like \"*activityName\". \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/usikup/1\">\nvar activity = hm.activity;\nvar get = activity.get;\nvar set = activity.set;\n\nget.getTextValue = function (e) {\n  return e.publisher.val();\n};\n\nget.getNodeValue = function (e) {\n  return e.publisher.get();\n};\n\nset.setLabelText = function (value, e) {\n  this.text(value);\n};\n\nset.setNodeValue = function (value, e) {\n  this.set(value);\n};\n  \n\nvar model = hm(\"helloApp\", {\n  name: \"\",\n  message: function () {\n    var name = this.get(\"name\").trim();\n    return name ? \"Hello, \" + name : \"\";\n  }\n});\n\n//reference activity by \"*activityName\"\nmodel.cd(\"name\").sub($(\"#txt1\"), \"keyup\", {\n  get: \"*getTextValue\",\n  set: \"*setNodeValue\"\n});\n\n$(\"#label1\").sub(model.cd(\"message\"), \"afterUpdate\", {\n  get: \"*getNodeValue\",\n  set: \"*setLabelText\"\n});\n</pre>\n\n<h3>Common activities \"getMember\" and \"setMember\"</h3>\n<p>\nHarmony also has special common activities \"getMember\" and \"setMember\", which can handle simple property get and set for jQuery objects and repository node, like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/enazep/2\">\nvar model = hm(\"helloApp\", {\n  name: \"\",\n  message: function () {\n    var name = this.get(\"name\").trim();\n    return name ? \"Hello, \" + name : \"\";\n  }\n});\n\n//reference activity by \"*activityName\"\nmodel.cd(\"name\").sub($(\"#txt1\"), \"keyup\", {\n  get: \"*getMember\",\n  getName: \"val\",\n  set: \"*setMember\",\n  setName: \"set\"\n});\n\n$(\"#label1\").sub(model.cd(\"message\"), \"afterUpdate\", {\n  get: \"*getMember\",\n  getName: \"get\",\n  set: \"*setMember\",\n  setName: \"text\"\n});\n</pre>\n\n<p>\nHarmony allow you use a shortcut to leverage these two common activities like below.\n</p>\n\n<pre>\npropertyName  , such as \"val\", \"text\", \"html\", \"get\", \"set\", \n//or\npropertyName*subPropertyName, such as \"get*name\", \"set*name\", \n\"attr*readonly\", \"css*background-color\"\n</pre>\n\n<p>\nThe following is refactory of above example, plus it add a css feature.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/omaduh/1\">\nvar model = hm(\"helloApp\", {\n  name: \"\",\n  message: function () {\n    var name = this.get(\"name\").trim();\n    return name ? \"Hello, \" + name : \"\";\n  },\n  color: \"\"\n});\n\nmodel.cd(\"name\").sub($(\"#txt1\"), \"keyup\", {\n  get: \"val\",\n  set: \"set\"\n  \n});\n\n$(\"#label1\").sub(model.cd(\"message\"), \"afterUpdate\", {\n  get: \"get\",\n  set: \"text\"\n});\n\nmodel.cd(\"color\").sub($(\"#color\"), \"keyup\", {\n  get: \"val\",\n  set: \"set\"\n});\n\n$(\"#color\").sub(model.cd(\"color\"), \"afterUpdate\", {\n  get:\"get\",\n  set: \"css*background-color\"\n});\n</pre>",
        "signatures": []
    },
    {
        "name": "workflow type",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler",
        "shortDesc": "workflow type",
        "longDesc": "<p>Workflow type is a prototype of workflow object.  We can use create a workflow by making a customized copy of workflow type.</p>",
        "signatures": [
            {
                "name": "hm.workflowType(name, workflowprototype)",
                "returns": "hm",
                "shortDesc": "",
                "desc": "<p>\nThe workflowProtoype object is very similar in the handler in event subscription and event binding. But it can have one additional activity which handler does have , \"initialize\" activity. In this activity you can customize the workflow instance of the workflow type. This activity is like the following\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction ( publisher, subscriber, workflowInstance, options ) {\n  //workflowInstance is an shadow copy of workflow type\n  //making change of it will not effect the original workflow type\n}\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.workflowType(name, workflow)",
                        "parameters": [
                            {
                                "name": "name",
                                "type": "string",
                                "desc": "the name workflow"
                            },
                            {
                                "name": "workflowPrototype",
                                "type": "string, function, object",
                                "desc": "the workflow to be cloned"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "<p>\nThe following create a simple workflow type, and use it in two event binding. Each binding use the create its own instance of the workflow type.\n</p>",
                        "code": "  hm.workflowType(\"greet\", function(e) {\n      alert(e.workflow.options);\n  });\n  \n  $(\"#hello\").handle(\"click\", \"*greet\", \"hello\");\n\n  $(\"#bye\").handle(\"click\", \"*greet\", \"bye\");",
                        "url": "http://jsbin.com/osojoq/2",
                        "jsbin": true
                    },
                    {
                        "desc": "The following example, it is refactory of previous one. It uses \"initialize\" activity to make sure that the option can not be missing, and than create an message based on options.",
                        "code": "  hm.workflowType(\"greet\", {\n    initialize: function (publisher, subscriber, instance, options) {\n      if (!options) {\n         throw \"workflow type 'greet' expect an options\"; \n      }\n     //modify the instance\n      instance.message = options;\n    },\n    get: function(e) {\n      hm.log(e.workflow.message);\n    }\n  });\n  \n  $(\"#hello\").handle(\"click\", \"*greet\", \"hello\");\n  \n  $(\"#bye\").handle(\"click\", \"*greet\", \"bye\");\n  \n  try {\n    $(\"#nogreeting\").handle(\"click\", \"*greet\");\n  } catch (e) {\n    hm.log(e, \"red\"); \n  }",
                        "url": "http://jsbin.com/odenuv/2",
                        "jsbin": true
                    }
                ]
            },
            {
                "name": "hm.workflowType(name)",
                "returns": "object",
                "shortDesc": "",
                "desc": "return a workflow type object with the name",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.workflowType(name)",
                        "parameters": [
                            {
                                "name": "name",
                                "type": "string",
                                "desc": "the name of the workflow"
                            }
                        ]
                    }
                ],
                "examples": []
            },
            {
                "name": "hm.workflowType()",
                "returns": "Object",
                "shortDesc": "",
                "desc": "return a hash table object of all the workflow type",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "get",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler.activity",
        "shortDesc": "get",
        "longDesc": "<p>\n\"get\" activity is the only required activity of both workflow object and workflow type. It is native form is like\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (e) {\n\n//return a value \n}\n</pre>\n\n<p>The purpose of this activity is to get a value from publisher, from an environment related to publisher. It should not modify anything. So that the activity can be composable to create other worklfow. However,  if this is not your purpose, you can put all the processing logic of a workflow inside this activity, in this case you don't return a value in this activity, and the workflow stop.  If you have logic distributed in other activity, it should return a value,  then the workflow will continue to \"convert\" activity, if it is available. If convert is not available, workflow will continue to \"set\" activity. This activity can be asynchronous, in this case it return a jQuery promise, which will resolve a value. When value is resolved, it follow the previous logic.\n</p>\n\n<p>\nYou can create common get activity like the following:\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.activity.get.myget = function (e) {\n\n};\n</pre>\n",
        "signatures": []
    },
    {
        "name": "convert",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler.activity",
        "shortDesc": "convert",
        "longDesc": "<p>\"convert\" activity is an optional activity. It is a function like the following, the value parameter is returned value of get activity or its resolved value.</p>\n<pre data-sub=\"prettyprint:_\">\nfunction (value, e) {\n\n//return a value \n}\n</pre>\n<p> Its purpose is to convert the result of get activity into a value consumable by \"set\" activity. For example convert a string into number, or an object, or convert a data into a markup using template engine. This activity should not cause any side effect to be composable to create a workflow. This activity can be also asynchronous, it can return a jQuery promise which return a value. When a value is resolved by returned jQuery promise, or it return a real value,  workflow will continue at \"set\" activity.  You can add a common activity like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.activity.convert.myconvert = function (value, e) {\n\n//return a value \n}\n</pre>",
        "signatures": []
    },
    {
        "name": "set",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler.activity",
        "shortDesc": "set",
        "longDesc": "<p>\"set\" activity is optional. It is like the following functions. The value is either return from get activity or set activity.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (value, e) {\n\n}\n</pre>\n\n<p>The purpose of the activity is to make change of subscriber with value passed passed it. It should not have any other side effect to make it composable to create a workflow. You can add a common set activity like below\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.activity.set.myset = function (value, e) {\n\n}\n</pre>",
        "signatures": []
    },
    {
        "name": "finalize",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler.activity",
        "shortDesc": "finalize",
        "longDesc": "<p>This activity is optional. It is like a function below. Sometimes,  there are some logics which can not be put into set activity,  because if so, the \"set\" activity will not be composable.  We can put these logics in  the \"finalize\" activity.  The template module use it import declarative declaration for mark-up.\n<p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (value, e) {\n\n}\n// to create an common activity,\n\nhm.activity.finalize.myfinalize = function (value, e) {\n\n}\n</pre>",
        "signatures": []
    },
    {
        "name": "initialize",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Handler.activity",
        "shortDesc": "initialize",
        "longDesc": "<p>This activity is not an activity of a workflow object, instead, is an optional activity of workflow type. When a subscription  with the workflow type is being created, it will be called. The following are the definition.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (publisher, subscriber, workflowInstance,  initializeOptions) {\n\n}\n//add a common initialize function like the following\nhm.activity.initialize.myinitialize =  function (publisher, subscriber, workflowInstance,  initializeOptions) {\n\n}\n</pre>\n\n<p>In the following example, greet workflow type has a initialize activity. And there are two subscriptions use it, each subscription create a instance of the workflow type,  and the workflow stances are initialized with their own options.  \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uvihed/4\">\nhm.workflowType(\"greet\", {\n    \n  initialize: function (publisher, subscriber, workflow, options) { \n    workflow.greeting = options;\n  },\n  \n  get: function (e) {\n    return e.workflow.greeting + \", \" + e.publisher.get();\n   \n  },\n    \n  set: \"text\"\n    \n  \n});\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n &lt;div data-sub=\"!init:name|*greet|Hello\"&gt;&lt;/div&gt;\n  \n  &lt;div data-sub=\"!init:name|*greet|Bye\"&gt;&lt;/div&gt;\n</pre>\n\n",
        "signatures": []
    },
    {
        "name": "Utilities",
        "type": "",
        "namespace": "Core.Unified Subscription",
        "shortDesc": "Utilites",
        "longDesc": "",
        "signatures": []
    },
    {
        "name": "mapEvent",
        "type": "",
        "namespace": "Core.Unified Subscription.Utilities",
        "shortDesc": "mapEvent",
        "longDesc": "",
        "signatures": [
            {
                "name": "publisher.mapEvent(sourceEvent, targetEvent[, condition])",
                "returns": "the publisher",
                "shortDesc": "when a event is triggered to publisher (repository node, or jQuery object), trigger another event to the publisher based on a condition.",
                "desc": "<p>The condition is a function like</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (e) { \n   //e.publisher == repository node, or jQuery object\n   //this == window\n   //return true or false; \n}\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "publisher.mapEvent(sourceEvent, targetEvent[, condition])",
                        "parameters": [
                            {
                                "name": "sourceEvent",
                                "type": "string",
                                "desc": "the event originally triggered on the publisher"
                            },
                            {
                                "name": "targetEvent",
                                "type": "string",
                                "desc": "the event to be mapped to"
                            },
                            {
                                "name": "condition",
                                "type": "function",
                                "desc": "optional function to determined whether it is ok to trigger the target event. It is default value is <code>function () { return true; }</code>"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following example how to map event for DOM element.",
                        "code": "  //mapEvent with a condition  \n  $(\"#guess input\").mapEvent(\"click\", \"bingo\", function (e) {   \n    return e.publisher.attr(\"data-bingo\") == \"true\";\n  });\n  \n  //mapEvent with no condition\n  $(\"#dog\").mapEvent(\"click\", \"wow\");\n  \n  \n  $(\"#guess\").handle(\"bingo\", function (e) {\n    \n    hm.log(\"bingo\");\n    \n  }).handle(\"wow\", function (e) {\n     \n    hm.log(\"wow\");\n  \n  });",
                        "url": "http://jsbin.com/eruber/2",
                        "jsbin": true
                    },
                    {
                        "desc": "The following event shows how to map event for repository node.",
                        "code": "  hm(\"count\", 100)\n    \n    .mapEvent(\"afterUpdate\", \"up\", function (e) {  \n   \n      return e.proposed > e.removed;\n      \n    })\n    .mapEvent(\"afterUpdate\", \"down\", function (e) {\n  \n      return e.proposed < e.removed;    \n  \n    })\n    .handle(\"up\", function (e) {\n    \n      hm.log(\"up\");\n  \n    })\n    .handle(\"down\", function (e) {\n    \n      hm.log(\"down\");\n  \n    });",
                        "url": "http://jsbin.com/ileduw/1",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "newViewEvent",
        "type": "",
        "namespace": "Core.Unified Subscription.Utilities",
        "shortDesc": "hm.newViewEvent(eventName, baseEventName, condition)",
        "longDesc": "",
        "signatures": [
            {
                "name": "hm.newViewEvent(eventName, baseEventName, condition)",
                "returns": "jQuery",
                "shortDesc": "create new event base on on existing event, when existing event triggered, the new event will trigger",
                "desc": "<p>This method does not used any other features of Harmony. It is different from $obj.mapEvent(oldEvent, newEvent, condition) in that, mapEvent is only valid for the selected element, and create new event is valid for all elements. The condition is like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction (e) {\n  //this refer to window\n //e is just a un-tampered jQuery event object\n}\n</pre>\n",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.newViewEvent(eventName, baseEventName, condition)",
                        "parameters": [
                            {
                                "name": "eventName",
                                "type": "string",
                                "desc": "the new event name to be created"
                            },
                            {
                                "name": "baseEventName",
                                "type": "string",
                                "desc": "the name of existing event"
                            },
                            {
                                "name": "condition",
                                "type": "function",
                                "desc": "the function which return true or false"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "",
                        "code": "  /*\n    the library also include the following code, so that you\n    can bind this event\n\n\thm.newViewEvent( \"enter\", \"keyup\",\n\t\tfunction( e ) {\n\t\t\treturn (e.keyCode === 13);\n\t\t}\n\t).newViewEvent( \"esc\", \"keyup\",\n\t\tfunction( e ) {\n\t\t\treturn (e.keyCode === 27);\n\t\t}\n\t);\n\n*/\n \n  hm.newViewEvent(\"ctrl\", \"keydown\", function (e) {\n    return e.ctrlKey;\n  });\n  \n  \n  \n  $(\"input\").bind(\"ctrl enter esc\", function (e) {\n    hm.log( e.type );\n   \n  });",
                        "url": "http://jsbin.com/ucefag/2",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "ns",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Declarative",
        "shortDesc": "ns",
        "longDesc": "",
        "signatures": [
            {
                "name": "ns:subPath",
                "returns": "",
                "shortDesc": "This is used to calcuate the namespace of the subscription group",
                "desc": "<p>This is an optional property, but a subscription can only have one \"ns\" property. </p>\n\n<p>To calculate the namespace of a subscription group, Harmony firstly search for its parent subscription group, which is the subscription group of closest subscription element. If it finds one, its namespace is used as parent namespace. If search is failed, the parent namespace is empty string which points to the root node of repository.\n</p>\n\n<p>After it finds the parent namespace, the ns property value is to be merged with the parent namespace to get the namespace of the current subscription group property. The rules of path merging is <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Repository.Path\">here</a>.</p>\n",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "ns:subPath",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "the relative path to the namespace of parent subscription group"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "\nThe following example, use the \"debug\" subscription group to output the \"ns\" property value of each elements which have data-sub attribute. \n",
                        "code": "  <div data-sub=\"debug:_\">\n    <div data-sub=\"ns:person;debug:_\">\n      <div id=\"1\" data-sub=\"ns:firstName;debug:_\">\n        <!-- id:10 does not have 'ns' property -->\n        <div id=\"10\" data-sub=\"debug:_\"></div>\n        <div id=\"11\" data-sub=\"ns:.;debug:_\"></div>\n        <div id=\"12\" data-sub=\"debug:_\"></div>\n        <div id=\"13\" data-sub=\"ns:..;debug:_\"></div>\n        <div id=\"14\" data-sub=\"ns:/;debug:_\"></div>\n        <div id=\"15\" data-sub=\"ns:/address;debug:_\"></div>\n        <div id=\"16\" data-sub=\"ns:..lastName;debug:_\"></div>\n        <div id=\"16\" data-sub=\"ns:_;debug:_\"></div>\n        <div id=\"17\" data-sub=\"debug:_\"></div>\n      </div>\n      <div id=\"2\" data-sub=\"ns:_;debug:_\">\n        <div id=\"21\" data-sub=\"ns:xx;debug:_\"></div>\n      </div>\n    </div>\n  </div>",
                        "url": "http://jsbin.com/ufodur/5",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "!events",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Declarative",
        "shortDesc": "!events",
        "longDesc": "<p>The \"!events\" property means the element subscribe events of a publisher with the a handler, and optional options, and optional delegate. A subscription group can have multiple \"!events\" properties.</p>",
        "signatures": [
            {
                "name": "!events:publisher|handler|options|delegate",
                "returns": "",
                "shortDesc": "",
                "desc": "<p>Here a couple possible variations</p>\n<pre data-sub=\"prettyprint:_\">\n!events:publisher|handler\n!events:publisher|handler|options\n!events:publisher|handler|_\n!events:publisher|handler|_|delegate\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "!events:publisher|handler|options|delegate",
                        "parameters": [
                            {
                                "name": "events",
                                "type": "string",
                                "desc": "event names separated by space"
                            },
                            {
                                "name": "publisher",
                                "type": "string",
                                "desc": "A publisher can be node or jQuery object. If publisher is a node, this parameter is sub-path relative to its default path of the element. The full path is their merged path. The path logic is <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Repository.Path\">here</a>. If publisher is jQuery selector, then this parameter should begin with \"$\". "
                            },
                            {
                                "name": "handler",
                                "type": "string",
                                "desc": "Handler is string expression handler, the syntax of the expression is <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Handler.string+expression\">here</a>"
                            },
                            {
                                "name": "options",
                                "type": "string",
                                "desc": "This parameter is optional. It is useful, when the handler is a workflow type and the workflow type has initialize method to handle the options. The workflow type details is <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Handler.workflow+type\">here</a>. You can explicitly set to undefined by using \"_\". If you have delegate behind, you can use syntax like : !events:publisher|handler|_|delgate. Otherwise, you can use !events:publisher|handler|_ or !events:publisher|handler."
                            },
                            {
                                "name": "delegate",
                                "type": "string",
                                "desc": "optional, a jQuery selector to enable jQuery delegate event, this is applicable only if publisher is a element"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "In the following example, the model is updated by a timer. The view subscribe to model's event using subscription group.",
                        "code": " <div data-sub=\"ns:app\">\n    \n    <p>\n      current time:\n      <!-- handler (#/app.showTime) is path expression,\n           handler (css*background-color) is activity expression\n      -->\n      <span data-sub=\"\n                 !init afterUpdate:currentTime|#/app.showTime;\n                 !init afterUpdate:color|css*background-color;\n                 debug:_\">\n      </span>\n    </p>\n    \n    <p>\n      Duration: \n      <!-- handler (text) is acivity expression -->\n      <span data-sub=\"!init afterUpdate:duration|text;\n                      debug:_\"  \n    </p>\n    \n      <!-- handler (*dump) is workflow type expression -->\n    <div data-sub=\"!init after*:.|*dump;\n                   debug:_\"></div>  \n  \n  </div>",
                        "url": "http://jsbin.com/asoper/2",
                        "jsbin": true
                    },
                    {
                        "desc": "",
                        "code": "  var model = hm(\"app\", {\n    startedOn: new Date(),\n    currentTime: new Date(),\n    color: \"green\",\n    showTime: function (e) {\n      var time = e.publisher.get();\n      var displayTime = getTime(time);\n      e.subscriber.text(displayTime);\n    },\n    //app.duration has implicit refrecne to app.startedOn\n    //app.startedOn's event will trigger this node\n    duration: function () {\n      return (this.get(\"currentTime\") - this.get(\"startedOn\"))/1000;\n    }\n  });",
                        "url": ""
                    },
                    {
                        "desc": "The following example shows how a element subscribe events of another element, with a delegate selector.",
                        "code": "\n\n<p data-sub=\"\n  !click:$#controlPanel|val css*background-color|_|.color;\n  debug:_\">\n    hello\n</p>\n\n<div id=\"controlPanel\">\n <input type=\"button\" class=\"color\" value=\"red\" >\n <input type=\"button\" class=\"color\" value=\"blue\" >\n <input type=\"button\" class=\"color\" value=\"green\" >\n</div>\n",
                        "url": "http://jsbin.com/ocemal/4",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "$events",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Declarative",
        "shortDesc": "$events",
        "longDesc": "<p>The \"$events\" property means an subscriber subscribe the events of the element with the a handler, and optional options, and optional delegate. Or we can say the element \"push\" event to a subscriber with a handler, optional options, and optional delegate. A subscription group can have multiple \"$events\" properties.\n</p>\n",
        "signatures": [
            {
                "name": "$events:subscriber|handler|options|delegate",
                "returns": "",
                "shortDesc": "",
                "desc": "<p>Here a couple possible variations</p>\n<pre data-sub=\"prettyprint:_\">\n$events:subscriber\n$events:subscriber|handler\n$events:subscriber|handler|_\n$events:subscriber|handler|_|delegate\n</pre>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "$events:subscriber|handler|options|delegate",
                        "parameters": [
                            {
                                "name": "events",
                                "type": "string",
                                "desc": "multiple event names separated by space"
                            },
                            {
                                "name": "subscriber",
                                "type": "string",
                                "desc": "A subscriber can be node or jQuery object. If subscriber is a node, this parameter is sub-path relative to its default path of the element. The full path is their merged path. The path logic is <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Repository.Path\">here</a>. If subscriber is jQuery selector, then this parameter should begin with \"$\"."
                            },
                            {
                                "name": "handler",
                                "type": "string",
                                "desc": "optional, string expression handler, the syntax of the expression is <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Handler.string+expression\">here</a>.  This parameter is optional, if the subscriber is repository node, and the node value is a function handler. In this case, the function is the handler."
                            },
                            {
                                "name": "options",
                                "type": "string",
                                "desc": "optional. It is useful, when the handler is a workflow type and the workflow type has initialize method to handle the options. The workflow type details is <a href=\"fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Handler.workflow+type\">here</a>. You can explicitly set to undefined by using \"_\". If you have delegate behind, you can use syntax like : $events:subscriber|handler|_|delegate. Otherwise, you can use $events:subscriber|handler|_ or $events:subscriber|handler"
                            },
                            {
                                "name": "delegate",
                                "type": "",
                                "desc": "optional, a jQuery selector to enable jQuery delegate event."
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following example demonstrate how to use $events property to let other subscribers subscribe events of the element, or how the element's event is handled by other subscriber.",
                        "code": "  <div data-sub=\"ns:myapp\">\n \n    <div>Your full name (first name, last name):</div>\n  \n    <!-- handler (#/myapp.handlers.updatePerson) is path expression-->\n    <input type=\"text\"\n    \n    data-sub=\"$keyup:person|#/myapp.handlers.updatePerson;\n              debug:_\" >\n    \n    <div>color:</div>\n    \n    <!-- handler(val) is activity expression-->\n    <input type=\"text\" data-sub=\"$keyup:color|val;\n                                 debug:_\" >\n    \n    <div>Password:(pasword is 123)</div>\n    \n    <!-- this no need for handler below, \n         because the subscriber (handlers.authenticate) is the handler\n    -->\n    <input type=\"text\" \n    \n    data-sub=\"$keyup:handlers.authenticate;\n              debug:_\" >\n    \n\n    <div data-sub=\"!init afterUpdate:passed|*show\">You are authenticated.</div>\n  \n  </div>\n  \n  <div data-sub=\"dump:myapp\"></div>\n  <div data-sub=\"logPanel:_\" ></div>",
                        "url": "http://jsbin.com/oyikes/82",
                        "jsbin": true
                    },
                    {
                        "desc": "",
                        "code": "  var model = hm(\"myapp\", {\n      \n    person: {\n      firstName: \"\",\n      lastName: \"\"\n    },\n    \n    color: \"\",\n    \n    passed: false,\n    \n    handlers: {\n      \n      updatePerson: function (e) {\n        \n        var fullName = $.trim(e.publisher.val());\n        parts = fullName.split(separator);\n        //\n        //here \"this\" refer to the e.subscriber myapp.person\n        //but not myapp.handlers\n        //\n        //to avoid the confusion, use e.subscriber instead here\n        //\n        e.subscriber.set(\"firstName\", parts[0] || \"\");\n        e.subscriber.set(\"lastName\", parts[1] || \"\");\n        \n      },\n      \n      authenticate: function (e) {\n        \n        var passed =  (e.publisher.val().trim() == \"123\");\n        \n        //e.subscriber is myapp.hanlers.authenticate\n        //we can do use the following here\n        //\n        //e.subscriber.set(\"...passed\", passed);\n        \n        //but it safer to use the following\n        //\n        model.set(\"passed\", passed);\n        \n      }\n    }",
                        "url": "",
                        "jsbin": true
                    }
                ]
            }
        ]
    },
    {
        "name": "mergePath",
        "type": "",
        "namespace": "Core.Repository.Path",
        "shortDesc": "hm.util.mergePath(contextPath, subPath)",
        "longDesc": "",
        "signatures": [
            {
                "name": "hm.util.mergePath(contextPath, subPath)",
                "returns": "string",
                "shortDesc": "<p>\nMerge a context path with a sub-path, return a full path.\n</p>",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.util.mergePath(contextPath, subPath)",
                        "parameters": [
                            {
                                "name": "contextPath",
                                "type": "string",
                                "desc": "the path of the context node"
                            },
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "the sub-path relative to the context node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "Common group",
        "type": "",
        "namespace": "Core.Unified Subscription.Subscription.Declarative",
        "shortDesc": "Common group",
        "longDesc": "<p>In CSS, instead of writing inline CSS rules, we can use a class to reference a external set of rules. Harmony support similar experience. Instead of writing <b>!events</b> and <b>$events</b> properties inline,  you can put them in another subscription group, then put the group in <span class=\"code\">hm.groups</span> with a name. We call this kind of group  <b>common group</b>.  Then we can reference this common group by using the group name inline. <span class=\"code\">text</span> is built-in common group, its definition is as following.</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.groups.text = \"!init after*:.|get text *toString\";\n</pre>\n\n<p>Now we can use the group name to reference the common group. In the following, two labels subscribe the events of displayTime, one use common group, one use inline events, they create the same subscription in runtime, but the one using group property is cleaner.\n</p>\n\n<pre data-sub=\"prettyprint:_;|preview:_|http://jsbin.com/atazon/1\">\n\n&lt;div data-sub=\"text:displayTime;debug:_\"&gt;&lt;/div&gt;\n&lt;div data-sub=\"!init afterUpdate:displayTime|get text *toString;debug:_\"&gt;&lt;/div&gt;\n</pre>\n\n<p>Common has the following features</p>\n<h3>Multiple common group</h3>\n<p>Just like an element can reference multiple CSS class,  an element group or common group can reference multiple common group.</p>\n\n<h3> Hierarchical group</h3> \n<p>You can nest one common group inside another common group, and the nesting can be any level deep.\nThe groups works hierarchically. The top group is element group, and then first level common groups which are referenced by element group, and then second level common groups which are reference by first level common groups, and so on. Each group will be converted into an <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Event.Event+Handling.Subscription+group\">group object</a>. The \"ns\" and \"options\" property of each group are passed down from the parent group. The namespace of a group is calculated based its namespace of its parent group. It uses the <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Repository.Path\">path calculation logic</a>. The following example shows how second level group's ns inherit is the ns from element group.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ajuhux/1\">\n\n  hm.groups.group1 = \"ns:group1Path;!event1:.\";\n  hm.printGroup(\"ns:elemPath;group1:.\");\n  //subscription's publisher is elemPath.group1Path\n</pre>\n\n<p>The following example show how third level group's ns from second level group and element group</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ucahay/2\">\n\n  hm.groups.group1 = \"ns:group1Path;!event1:.\";\n  hm.groups.group2 = \"ns:group2Path;group1:.\";\n  hm.printGroup(\"ns:elemPath;group2:.\");\n  //subscription's publisher is elemPath.group2Path.group1Path\n</pre>\n\n<p>Group options works a bit different from ns. By default, group options will overwrite !events or $events options. Like the following.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ajuhux/1\">\n\nhm.groups.group1 = \"!event1:.|handler1|option1\";\nhm.printGroup(\"group1:elemPath|elemOption\");\n //subscription's option is elemOption\n</pre>\n\n<p>If we want to protect !events or $events' options from being overwritten by group options,  we should use \"_\" prefix like the following.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/olivob/1\">\n   hm.groups.group1 = \"!event1:.|handler1|_option1\";\n  hm.printGroup(\"group1:elemPath|elemOption\");\n  //subscription's option is option1\n</pre>\n\n<p>or</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ucekof/1\">\n   hm.groups.group1 = \"!event1:.|handler1|_\";\n  hm.printGroup(\"group1:elemPath|elemOption\");\n  //subscription's option is undefined\n</pre>",
        "signatures": [
            {
                "name": "commonGroupName:path|options",
                "returns": "",
                "shortDesc": "group property of declarative subscription",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "commonGroupName:path|options",
                        "parameters": [
                            {
                                "name": "commonGroupName",
                                "type": "string",
                                "desc": "any string value which is not \"ns\" and does not begin with \"!\" or $\"."
                            },
                            {
                                "name": "path",
                                "type": "string",
                                "desc": "sub-path relative to the context path of subscription group."
                            },
                            {
                                "name": "options",
                                "type": "string",
                                "desc": "optional options of the group property"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "trigger",
        "namespace": "Core.Unified Subscription.Utilities",
        "shortDesc": "trigger",
        "longDesc": "<p>This method allows you manually trigger a event to repository node. It is useful when you write extended node methods, or directly update the model.\n</p>",
        "signatures": [
            {
                "name": "hm.trigger( publisherPath, originalPublisherPath, eventType[, proposed[, removed ]]) ",
                "returns": "hm",
                "shortDesc": "trigger an repository event",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "hm.trigger( path, originalPath, eventType, proposed, removed )",
                        "parameters": [
                            {
                                "name": "path",
                                "type": "string",
                                "desc": "the path of a node"
                            },
                            {
                                "name": "originalPath",
                                "type": "string",
                                "desc": "the path of original node, this is normally the same as path, in Harmony, it is different when implementing bubbling."
                            },
                            {
                                "name": "eventType",
                                "type": "the name of node event",
                                "desc": ""
                            },
                            {
                                "name": "proposed",
                                "type": "object",
                                "desc": "optional, the value of proposed change"
                            },
                            {
                                "name": "removed",
                                "type": "object",
                                "desc": "optional, the old value of the node"
                            }
                        ]
                    }
                ],
                "examples": []
            },
            {
                "name": "node.trigger([subPath,] eventName, proposed, removed)",
                "returns": "node",
                "shortDesc": "trigger events to node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.trigger([subPath,] eventName[, proposed[, removed]])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "sub-path relative to the current node, it is current node if this missing"
                            },
                            {
                                "name": "eventName",
                                "type": "string",
                                "desc": "the name of repository event"
                            },
                            {
                                "name": "proposed",
                                "type": "object",
                                "desc": "optional, the value of proposed change"
                            },
                            {
                                "name": "removed",
                                "type": "object",
                                "desc": "optional, the value of old value of the node"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "The following update a model directly instead of using repository model, the raise an custom event. The subscription to customs event will be notified.",
                        "code": "  hm.set(\"person\", {\n    firstName: \"\",\n    lastName: \"\",\n    changeName: function (firstName, lastName) {\n      \n      var person = this.get();\n      var oldPerson = hm.util.clone(person);\n      person.firstName = firstName;\n      person.lastName = lastName;\n      //raised a custom event\n      this.trigger(\"nameChanged\", person, oldPerson);\n    }\n  });\n  \n  hm.handle(\"person\", \"nameChanged\", function (e) {\n    hm.log(\"person is changed from \" + JSON.stringify(e.removed) + \" to \" + JSON.stringify(e.proposed));\n    \n  });\n  \n  hm(\"person\").set(\"changeName\", \"John\", \"Doe\");",
                        "url": "http://jsbin.com/iwonad/2"
                    }
                ]
            }
        ]
    },
    {
        "name": "Dynamic group",
        "namespace": "Core.Unified Subscription.Subscription.Declarative.Common group",
        "shortDesc": "Dynamic group",
        "longDesc": "<p>Dynamic group is special type of common group.  It use the same reference syntax, path calculation logic, and options rules. The normal  common group is static collection of subscriptions, like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.groups.text = \"!init after*:.|get text *toString\";\n</pre>\n\n<p>It does not change according to environment. Dynamic group is different, it is a function like below. You decide what needs to be done in the function, such as initialization, and subscription. The following is dummy dynamic group.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ahonek/1\">\n\n\n\nhm.groups.dynamicGroup1 = function( elem, path, contextGroup, options ) {\n    hm.log(\"dynamicGroup1 group is called, path:\" + path + \n        \" , options:\" + options);\n  };\n  hm.printGroup(\"dynamicGroup1:path1|options1\");\n</pre>\n\n<p>\nThe contextGroup parameter is the group which contain the group reference, in the above cast, it is element group. The group \"logPanel\" is used throughout examples, it is actually a simple group, which create a nested ol element with some style, and then subscribe ol element to the events of the node at path \"*log\". Whenever, hp.log() is called, the node will raised some update events, and the ol element is refreshed because of these subscription. The following is its definition and an example to print out the \"logPanel\" group's result to the logPanel.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/efeqeh/1\">\n&lt;div data-sub=\"logPanel:.;debug:_\"&gt;&lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\nhm.groups.logPanel = function (elem, path, group, options) {\n  var $elem = $(elem),\n    $ol = $elem.is(\"ol\") ? $elem : $(\"&lt;ol style='font-family: monospace, serif' /&gt;\").appendTo($elem),\n    ol = $ol[0];\n\n group.appendSub(ol, \"*log\", \"init\", function (e) {\n    var allLogs = e.publisher.get();\n    for (var i = 0; i & lt; allLogs.length; i++) {\n      $ol.append(\"&lt;li&gt;\" + allLogs[i] + \"&lt;/li&gt;\");\n    }\n  });\n\n  group.appendSub(ol, \"*log\", \"afterCreate.1\", function (e) {\n    $ol.append(\"&lt;li&gt;\" + e.originalPublisher.raw() + \"&lt;/li&gt;\");\n  });\n\n  group.appendSub(ol, \"*log\", \"afterCreate\", function (e) {\n    $ol.empty();\n  });\n};\n</pre>\n\n<p>\nAlthough, you can use hm.sub() directly instead of using group.appendSub, but the it will not create change the subscriptions object of the group, and the debugging info will not be printout. So try to use group.appendSub instead. Sometimes, the order of subscriptions is important. If you want to create a subscription first, you should use prependSub method. If you want to clear all the subscriptions created before you can use the clearSubs method. You can see their usage in the following example.\n</p>\n\n<h3>Special dynamic group: code, preSub, postSub</h3>\n<p>If you want inject some code a dynamic group, but you don't want to to create a common group, you can use three built-in dynamic groups. These three group can run a function in repository during the element subscription group is imported. They are executed in different stage of the process. The code group executes during parsing, and you can have multitple code group. The preSub group is executed after parsing is completed but before subscriptions are created. The postSub group is executed after subscriptions are created. The following example shows these sequence.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ayihiw/2\">\n  &lt;div data-sub=\n      \"ns:myapp;\n       code:code;\n       preSub:preSub;\n       postSub:postSub\"&gt;\n  &lt;/div&gt;\n</pre>\n<pre data-sub=\"prettyprint:_\">\nhm(\"myapp\", {\n  \n  code: function( elem, path, group, options ) {\n  \n    hm.log(\"dynamic group: 'code' is running\");\n    \n    //insert at the tail\n    group.appendSub(\n      \"subscriber1\", \n      \"publisher1\", \n      \"eventTypes1\", \n      \"handler1\", \n      \"options1\", \n      \"delegate1\");\n    \n    //insert at the head\n    group.prependSub(\n      \"subscriber2\", \n      \"publisher2\", \n      \"eventTypes2\", \n      \"handler2\", \n      \"options2\", \n      \"delegate2\");\n    \n  },\n  \n  preSub: function (elem, path, group, options) {\n    \n    hm.log(\"dynamic group: 'preSub' is running\");\n    \n    hm.log(JSON.stringify(group.subscriptions));\n    \n    //after clearSubs() is called, there will\n    //be no subscritpion to be create\n    group.clearSubs();\n    \n    hm.log(JSON.stringify(group.subscriptions));\n    \n  },\n  \n  postSub: function (elem, path, group, options) {\n    \n    hm.log(\"dynamic group: 'postSub' is running\");\n  \n  }\n  \n});\n</pre>\n",
        "signatures": []
    },
    {
        "name": "activities",
        "namespace": "Core.Template",
        "shortDesc": "activites",
        "longDesc": "<p>\nWorkflow activities are the building block of template workflow type.  All template workflow type use three special activities, they are initialize activity \"templateOptions\", convert activity \"dataToMarkup\", finalize activity, \"parseSub\".\n</p>",
        "signatures": []
    },
    {
        "name": "workflow types",
        "namespace": "Core.Template",
        "shortDesc": "workflow types",
        "longDesc": "<p>\nThere two template workflow type, \"renderContent\" and \"renderSelf\".  They both use <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.templateOptions\">initialize.templateOptions</a>, <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.dataToMarkup\">convert.dataToMarkup</a>, and <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.parseSub\">finalize.parseSub</a>. You can easily compose a new template workflow with them and  your own \"get\", \"set\" activities, like the following one.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderContent\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", //extensible\n  convert: \"*dataToMarkup\",\n  set: \"html\", //extensible\n  finalize: \"*parseSub\"\n});\n</pre>\n<p>\nTo save your a few keystroke, you can use \n</p>\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderContent\",  hm.template.newTemplateWorkflow ( \"get\", \"set\" );\n</pre>",
        "signatures": []
    },
    {
        "name": "subscription groups",
        "namespace": "Core.Template",
        "shortDesc": "subscription groups",
        "longDesc": "<h3>for, forSelf, forChildren, forAll</h3>\n\n<p>These four common subscription groups use <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.workflow+types.renderContent\">renderContent </a> workflow types, which get the value of a node and render a DOM markup with a workflow id, and set the content of the element with the markup.  The difference between these activities is when the content of the element is regenerated. Because the whole content is regenerated, they are not quite efficient for large content generation, but it is simple to use.</p>\n\n<pre data-sub=\"prettyprint:_\">\n//content generated on subscription is created only\nhm.groups[\"for\"] = \"!init:.|*renderContent\";\n\n//content (re-)generated on subscription is created , and \n//after the model is updated, \n//but not when its descendants are updated\nhm.forSelf = \"!init after*.:.|*renderContent\";\n\n//content (re-)generated on subscription is created , and \n//after the model  and its direct children are updated, \n//but not when its down level descendants are updated\nhm.forChildren = \"!init after*. after*.1:.|*renderContent\";\n\n//content (re-)generated on subscription is created , and \n//after the model and all level of descendants  are updated, \nhm.forAll = \"!init after*:.|*renderContent\";\n</pre>\n\n<p>\nThe following example show differences of four table generated by these subscription groups. Please click <a target=\"_blank\" href=\"http://jsbin.com/opilek/2/edit\">here</a> to see the full example.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/opilek/3\">\n\n\n&lt;tbody data-sub=\"for:contacts|personTemplate\"&gt;&lt;/tbody&gt;\n&lt;tbody data-sub=\"forSelf:contacts|personTemplate\"&gt;&lt;/tbody&gt;\n&lt;tbody data-sub=\"forChildren:contacts|personTemplate\"&gt;&lt;/tbody&gt;\n&lt;tbody data-sub=\"forAll:contacts|personTemplate\"&gt;&lt;/tbody&gt;\n</pre>\n\n<h3>renderSelf</h3>\n<p>Its definition is as following.</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.groups.renderSelf = \"!init:.|*renderSelf\";\n</pre>\n\n<p>\nThis subscription group will run the workflow <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.workflow+types.renderSelf\">renderSelf</a> on subscription is created only. What the workflow does is get the data of the node and template id, and generate markup, and replace the element with the markup.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/iyupen/1\">\n  &lt;script type=\"jsrender\" id=\"contactsTemplate\"&gt;\n      &lt;tr&gt;\n\t\t&lt;td&gt;\n          {{:firstName}}\n\t\t&lt;/td&gt;\n\t\t&lt;td&gt;\n          {{:lastName}}\n\t\t&lt;/td&gt;\n\t&lt;/tr&gt;\n  &lt;/script&gt;\n  \n  &lt;table&gt;\n    &lt;tr&gt;\n      &lt;td&gt;First Name&lt;/td&gt;\n      &lt;td&gt;Last Name&lt;/td&gt;\n\t&lt;/tr&gt;\n    &lt;tr data-sub=\"renderSelf:app.contacts|contactsTemplate\"&gt;&lt;/tr&gt;\n  &lt;/table&gt;\n</pre>\n",
        "signatures": []
    },
    {
        "name": "renderContent",
        "namespace": "Core.Template.workflow types",
        "shortDesc": "renderContent",
        "longDesc": "<p>This workflow is defined as below.</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderContent\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", //extensible\n  convert: \"*dataToMarkup\",\n  set: \"html\", //extensible\n  finalize: \"*parseSub\"\n});\n</pre>\n\n<p>\nThe activities of <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.templateOptions\">templateOptions</a> , <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.dataToMarkup\">dataToMarkup</a>, <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.parseSub\">parseSub</a> are shared by all template workflow type. What is special here, is that , the worklow's get activity, simply just get the value of publisher, and use jQuery html method to fill the content of subscriber, which here is an html element.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ejeten/1\">\n  &lt;table&gt;\n    &lt;tr&gt;\n      &lt;td&gt;First Name&lt;/td&gt;\n      &lt;td&gt;Last Name&lt;/td&gt;\n\t&lt;/tr&gt;\n    &lt;tbody data-sub=\"!init:app.contacts|*renderContent\"&gt;\n      &lt;tr&gt;\n\t\t&lt;td&gt;\n          {{:firstName}}\n\t\t&lt;/td&gt;\n\t\t&lt;td&gt;\n          {{:lastName}}\n\t\t&lt;/td&gt;\n\t&lt;/tr&gt;\n\t&lt;/tbody&gt;\n  &lt;/table&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "renderSelf",
        "namespace": "Core.Template.workflow types",
        "shortDesc": "renderSelf",
        "longDesc": "<p>This workflow is defined as below.</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderSelf\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", //extensible\n  convert: \"*dataToMarkup\",\n  set: \"replaceWith\", //extensible\n  finalize: \"*parseSub\"\n});\n</pre>\n\n<p>\nThe activities of <a href=\"\">templateOptions</a> , <a href=\"\">dataToMarkup</a>, <a href=\"\">parseSub</a> are shared by all template workflow type. What is special here, is that , the worklow's get activity, simply just get the value of publisher, and use jQuery \"replaceWith\" method to replace subscriber itself with the generated mark-up.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/egiluk/2\">\n    &lt;script type=\"jsrender\" id=\"contactsTemplate\"&gt;\n      &lt;tr&gt;\n\t\t&lt;td&gt;\n          {{:firstName}}\n\t\t&lt;/td&gt;\n\t\t&lt;td&gt;\n          {{:lastName}}\n\t\t&lt;/td&gt;\n\t&lt;/tr&gt;\n  &lt;/script&gt;\n  \n  &lt;table&gt;\n    &lt;tr&gt;\n      &lt;td&gt;First Name&lt;/td&gt;\n      &lt;td&gt;Last Name&lt;/td&gt;\n\t&lt;/tr&gt;\n    &lt;!-- this will be replaced with the mark-up --&gt;\n    &lt;tr data-sub=\"!init:app.contacts|*renderSelf|contactsTemplate\"&gt;&lt;/tr&gt;\n  &lt;/table&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "templateOptions",
        "namespace": "Core.Template.activities",
        "shortDesc": "templateOptions (initialize activity)",
        "longDesc": "<p>This is a common activity, it is used to build a template options from a string in the following format.</p>\n\n\n<h3><code>templateId[,wrapDataInArray[,engineName]]</code></h3>\n\n<p>The <code>templateId</code> is required, <code>wrapDataInArray</code> is either 'true' or 'false', but it is optional. <code>engineName</code> is the name of engine, which is also optional, if it is missing, the value of <code>hm.template.defaultEngine</code> is used. </p>\n\n<p>This activity extract  templateId, wrapDataInArray, and engineName from the options, and then attached it to the handler. It is a like a function below, it will be called on subscription creation. The following is test case. \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/afufig/4\">\n\n\n/*\nhm.activity.initialize.templateOptions = \nfunction( publisher, subscriber, work, options ) {};\n*/\n\nvar publisher = {}, \n    subscriber = {},\n    workflow = {},\n    templateOptions = hm.activity.initialize.templateOptions;\n    \n\ntemplateOptions(\n  publisher, \n  subscriber, \n  workflow, \n  \"myTemplateId,true,jsrender\");\n\n\nhm.log(JSON.stringify(workflow));\n\nworkflow = {};\n\ntemplateOptions(\n  publisher, \n  subscriber, \n  workflow, \n  \"myTemplateId\");\n\nhm.log(JSON.stringify(workflow));\n</pre>\n\n<p>If you have inline template inside the element like <a target=\"_blank\" href=\"http://jsbin.com/ejeten/1/edit\">this example</a>, you don't need an options, it will compile the template and assign it a unique template id, and use it as templateId for the workflow instance.</p>\n\n<p>You can create a workflow type by referencing it like below</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderContent\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", //extensible\n  convert: \"*dataToMarkup\",\n  set: \"html\", //extensible\n  finalize: \"*parseSub\"\n});\n</pre>",
        "signatures": []
    },
    {
        "name": "dataToMarkup",
        "namespace": "Core.Template.activities",
        "shortDesc": "dataToMarkup (convert activity)",
        "longDesc": "<p>\nThis activity is defined like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.activity.convert.dataToMarkup = function( data, e ) {\n//data is provided by \"get\" activities\n//e.workflow.templateId is provided in \"initialize\" activity \"templateOptions\"\n//templateAdapter.render( templateId, data, renderContext) ;\n}\n</pre>\n\n<p>The  data provided in \"get\" activity and the template id provided in \"initialize\" activity \"templateOptions\" are passed into this activity, it just combine this two resource into DOM element and return out. Normally you don't call this function directly, instead you use it to compose your template handler like the the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderContent\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", //extensible\n  convert: \"*dataToMarkup\",\n  set: \"html\", //extensible\n  finalize: \"*parseSub\"\n});\n</pre>\n<h3>Unit test your template</h3>\n<p>But you can use it to unit test your template with this activity like the following example.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/egiluk/6\">\nhm(\"app\", {\n  \"contacts\": [{\n    firstName: \"John\",\n    lastName: \"Doe\"\n  }, {\n    firstName: \"Jane\",\n    lastName: \"Roe\"\n  }]\n});\nvar e = {\n  publisher: hm(\"app.contacts\"),\n  workflow: {\n    templateId: \"contactsTemplate\"\n  }\n};\n\nvar elements = hm.activity.convert.dataToMarkup(hm.get(\"app.contacts\"), e);\n\n$(\"tbody\").html(elements);\n</pre>\n<pre data-sub=\"prettyprint:_\">\n  &lt;script type=\"jsrender\" id=\"contactsTemplate\"&gt;\n    &lt;tr&gt;\n     &lt;td&gt;\n         {{:firstName}}\n\t&lt;/td&gt;\n\t&lt;td&gt;\n          {{:lastName}}\n\t&lt;/td&gt;\n\t&lt;/tr&gt;\n  &lt;/script&gt;\n  &lt;table&gt;\n    &lt;thead&gt;\n    &lt;tr&gt;\n      &lt;td&gt;First Name&lt;/td&gt;\n      &lt;td&gt;Last Name&lt;/td&gt;\n\t&lt;/tr&gt;\n    &lt;/thead&gt;\n    &lt;tbody&gt;\n    &lt;/tbody&gt;\n  &lt;/table&gt;\n</pre>\n\n<h3>render context</h3>\n<p>Harmony does include a template engine, instead it uses a template adapter to redirect the work to template engine, like this <code>templateAdapter.render( templateId, data, context ) ;</code>. By default, Harmony use \"jsrender\" adapter. If \"jsrender\" is not your template engine, you can implement a template adapter, which is relatively easy compared to implement a template engine.  The render call also pass an context object like below.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nrenderContext = {\n  modelPath: publisher.path,\n  e: e,\n  get: function ( /*subPath, p1, p2, ..*/ ) {\n    return e.publisher.get.apply(\n    e.publisher,\n    slice.call(arguments));\n  }\n};\n</pre>\n\n<p>This is an useful object,  it gives your access to the repository and event object. When you implement the a template adapter, you might want to use in your template. The \"jsrender\" adapter does make use it. The following is an example on how to use context object in \"jsrender\" template. \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/iriloh/1\">\n &lt;script type=\"jsrender\" id=\"contactsTemplate\"&gt;\n    &lt;tr&gt;\n      &lt;td&gt;\n          {{get \"..getTitle\" gender /}}                          \n     &lt;/td&gt;   \n\t&lt;td&gt;\n     {{:firstName}}\n\t&lt;/td&gt;\n\t&lt;td&gt;\n          {{:lastName}} \n\t&lt;/td&gt;\n     &lt;td&gt;     \n       {{prop \"fullName\" /}}                               \n   &lt;/td&gt;\n &lt;/tr&gt;\n&lt;/script&gt;\n</pre>\n<pre data-sub=\"prettyprint:_\">\nvar Person = hm.Class.extend({\n  fullName: function () {\n    return this.get(\"firstName\") + \" , \" + this.get(\"lastName\");\n  }\n});\n\nhm(\"app\", {\n  \"contacts\": Person.list([{\n    firstName: \"John\",\n    lastName: \"Doe\",\n    gender: \"m\"\n  }, {\n    firstName: \"Jane\",\n    lastName: \"Roe\",\n    gender: \"f\"\n  }]),\n\n  getTitle: function (gender) {\n    if (gender == \"m\") {\n      return \"Mr.\";\n    } else {\n      return \"Mrs.\";\n    }\n  }\n});</pre>\n<h3>External template loading</h3>\n<p>Harmony support asynchronous convert activity which returns a jQuery promise. This is useful for external template loading, because it is asynchronous operation. The default implementation of dynamic template loading, depends <a href=\"\">marix.js</a>.  If you want to implement your own, please refer <a href=\"\">here</a>. </p>\n<p>\nThe following example demonstrate the \"dataToMarkup\" activity can return a promise. This activity try to load a external template which is hosted <a href=\"http://jsbin.com/uxunaj/1/edit\">here</a> . It also override the default mapping between template id and template url.  For more information, please refer to <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins.external+template\">External template loading</a></p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uxobir/4\">\n  //overwrite the mapping between template id \n  //and the url of the template\n  //hardcode it to http://jsbin.com/uxunaj/1  \n  hm.template.templateIdToUrl = function (templateId) {\n     return \"/uxunaj/1\"; \n  };\n  \n    hm(\"app\", {\n    \"contacts\": [{\n      firstName: \"John\",\n      lastName: \"Doe\"\n    }, {\n      firstName: \"Jane\",\n      lastName: \"Roe\",\n      gender: \"f\"\n    }]\n  });\n\n\n  var e = {\n    publisher: hm(\"app.contacts\"),\n    workflow: {\n      templateId: \"contactsTemplate\"\n    }\n  };\n //because the template is not in this page\n  //the conversion return a jQuery promise\n  var dataToMarkup = hm.activity.convert.dataToMarkup;\n  var promise = dataToMarkup(hm.get(\"app.contacts\"), e);\n\n  //when the promise is resolved, do the rest of the work\n  promise.done(function (elements) {\n    $(\"tbody\").html(elements);  \n  });\n</pre>",
        "signatures": []
    },
    {
        "name": "parseSub",
        "namespace": "Core.Template.activities",
        "shortDesc": "parseSub (finalize activity)",
        "longDesc": "<p>This activity is defined as below \n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.activity.finalize.parseSub = function( value, e ) { \n $( value ).parseSub();                                                                                       \n};                                                     \n</pre>\n\n<p>After dataToMarkup activity and set activity finish their works, and the mark-up is merged to the page, this activity will run and import the subscriptions declared in the mark-up. The following shows the difference two workflow types, one has this activity, one hasn't.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/afufig/6\">\n \n  &lt;script type=\"jsrender\" id=\"myTemplate\"&gt;\n    &lt;div data-sub=\"ns:myapp\"&gt;\n      &lt;lable&gt;firstName: &lt;input type=\"text\" data-sub=\"val:firstName|keyup\" &gt;&lt;/label&gt;\n      &lt;lable&gt;lastName: &lt;input type=\"text\" data-sub=\"val:lastName|keyup\" &gt;&lt;/label&gt;\n       &lt;div data-sub=\"text:fullName\"&gt;&lt;/div&gt;\n  &lt;/div&gt;\n  &lt;/script&gt;\n  \n  &lt;div&gt;The following render &lt;b&gt;without&lt;/b&gt; parseSub \"finalize\" activity&lt;/div&gt;\n  &lt;div data-sub=\"!init:.|*renderSelfWithoutFinalizer|myTemplate\"&gt;\n  &lt;/div&gt;\n  \n  &lt;hr /&gt;\n  \n  &lt;div&gt;The following render &lt;b&gt;with&lt;/b&gt; parseSub \"finalize\" activity&lt;/div&gt;\n  &lt;div data-sub=\"!init:.|*renderSelf|myTemplate\"&gt;\n  &lt;/div&gt;\n  \n  &lt;div data-sub=\"logPanel:_\"&gt;&lt;/div&gt;\n</pre>\n<pre data-sub=\"prettyprint:_\">\nhm.workflowType(\"renderSelfWithoutFinalizer\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", \n  convert: \"*dataToMarkup\",\n  set: \"replaceWith\"\n});\n\nhm.workflowType(\"renderSelf\",  {\n  initialize: \"*templateOptions\",\n  get: \"get\", \n  convert: \"*dataToMarkup\",\n  set: \"replaceWith\",\n  finalize: \"*parseSub\"\n});\n\n\nhm(\"myapp\", {\n  firstName: \"John\",\n  lastName: \"Doe\",\n  fullName: function () {\n    return this.get(\"firstName\") + \",\" + this.get(\"lastName\"); \n  }  \n});\n</pre>\n\n<p>\nThis is very simple activity, but it is very powerful, with it we can recursively render a view. Here is an example, of this recursive rendering.  The following begin with an empty body, because of this activity and other template workflow type, the whole application can be created.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/umaquf/11\">\n&lt;body data-sub=\"for:/|rootView\"&gt;&lt;/body&gt;\n</pre>\n",
        "signatures": []
    },
    {
        "name": "template types",
        "namespace": "Core.Template",
        "shortDesc": "template types",
        "longDesc": "<p>In CCS, we have inline style, internal style sheet, external style sheet. Similar to this, in harmony, there are three types of templates, inline template, internal template,  and external template.\n</p>\n\n<h3>Inline template</h3>\n<p>Inline template does not have any id, so you don't need have a template options when use template workflow. The following is an example. </p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ejeten/2\">\n&lt;table&gt;\n  &lt;tr&gt;\n    &lt;td&gt;First Name&lt;/td&gt;\n    &lt;td&gt;Last Name&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tbody data-sub=\"for:app.contacts\"&gt;\n    &lt;tr&gt;\n      &lt;td&gt;{{:firstName}}&lt;/td&gt;\n      &lt;td&gt;{{:lastName}}&lt;/td&gt;\n    &lt;/tr&gt;\n  &lt;/tbody&gt;\n&lt;/table&gt;\n</pre>\n\n<p>The content inside of of the <code>tbody</code> is template mark-up, template workflow will compiled with default template engine, give it an internal id. This is simple to use, but it has limitations. The template can be only used by the container, it can not be used by other container, because other container does not know its Id. The the template can not have another inline template inside, you do use a template with an Id inside of inline template.\n</p>\n\n<h3>Internal template</h3>\n<p>Internal template has an id, it can be used across the the page like the following.</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ufusoj/1\">\n&lt;script id=\"contactsTemplate\" type=\"jsrender\"&gt;\n  &lt;tr&gt; &lt;td&gt; {{: firstName }} &lt;/td&gt;\n\t&lt;td&gt;{{:lastName}}&lt;/td&gt; \n  &lt;/tr&gt;\n&lt;/script&gt;\n&lt;table&gt;\n  &lt;tr&gt;\n    &lt;td&gt;First Name&lt;/td&gt;\n    &lt;td&gt;Last Name&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tbody data-sub=\"for:app.contacts|contactsTemplate\"&gt;&lt;/tbody&gt;\n&lt;/table&gt;\n</pre>\n\n<p>If your application has a few template, it is ok to use internal template. But if you have more and more internal template, your page be still not quite maintainable.\n</p>\n\n<h3>External template</h3>\n<p>Like external CSS style sheet, external template reside in an external file, which can be pre-loaded or dynamically loaded. But it is not part of harmony core, for more please see <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins.external+template\">here</a>.\n</p>",
        "signatures": []
    },
    {
        "name": "engine adapter",
        "namespace": "Core.Template",
        "shortDesc": "template engine adapter",
        "longDesc": "<p>Harmony does not include a template engine, instead it uses template adapters to talk to actual template engine.  Harmony includes a template adapter for workflow engine <a href=\"https://github.com/BorisMoore/jsrender\">jsrender</a>.  To add an adapter, use the following syntax.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.template.engineAdapter( \"jsrender\", {\n  render: function( templateId, data, context ) { }\n  //...additional member\n});\n</pre>\n\n<p>Once this method is called, the default template engine will be \"jsrender\", if a <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.templateOptions\">templateOptions</a> does not include an engine name, this value will be used. If you want to change another engine as default engine use the follow: </p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.template.defaultEngine = \"anotherEngine\";\n</pre>\n\n<p>Because of <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins.external+template\">external template</a>, there are two kinds of rendering,  synchronous rendering, asynchronous rendering. Asynchronous rendering happens when workflow try to render mark-up and template is not avaiable, this is optional to implement.</p>\n\n<h3>Implementing synchronous rendering</h3>\n<p>To implement synchronous rendering, you need <b>one and only one</b> method in your adapter. This method can return <b>string or DOM elements</b>. The following is how jsrender adapter's  implementation.</p>\n<pre data-sub=\"prettyprint:_\">\njsRenderAdapter.render = function (templateId, data, context) {\n  if (!$.render[templateId]) {\n    this.compile(templateId,\n    document.getElementById(templateId).innerHTML);\n  }\n  return $.render[templateId](data, context);\n};\n</pre>\n\n<h3>Implementing asynchronous rendering</h3>\nTo implement this, you have a couple of options. But regardless which options, firstly you must implement adapter.isTemplateLoaded method. Without it,  Harmony doesn't  know whether it is sync or async. Here is jsRender adapter's implementation.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\njsRenderAdapter.isTemplateLoaded = function (templateId) {\n  return !!$.render[templateId] || !! document.getElementById(templateId);\n};\n</pre>\n\n<p>Additionally, you need to implement one of the following.</p>\n\n<h4>Option 1: implement adapter.async</h4>\n\n<p>This method should return a jQuery promise, which promise to deliver text or DOM element. Here it is signature:</p>\n\n<pre data-sub=\"prettyprint:_\">\njsRenderAdapter.renderAsync = function(templateId, data, renderContext ) {\n//return jQuery promise which promise to deliver text or DOM element\n};\n</pre>\n\n<h4>Option 2: implement <code>hm.template.load()</code></h4>\n\n<p>This method return an empty promise. When the template is loaded, you signal that the promise is done, Harmony will call <code>adapter.render()</code>. The method is like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.template.load = function( templateId ) { \n  throw \"not implemented\";\n //return an empty promise\n}\n</pre>\n\n<h4>Option 3: <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins.external+template\">External template</a> plugin implement adapter.compile</h4>\n\n<p>The plugin <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins.dynamic+template\">external template</a> implements <code>hm.template.load()</code>.  However,  you need to implement <code>adapter.compile()</code> method, because external template plugins depends on this indirectly.  The following \"jsRender\" adapter's implementation.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\njsRenderAdapter.compile = function (templateId, source) {\n  $.templates(templateId, {\n    markup: source,\n    debug: jsRenderAdapter.templateDebugMode,\n    allowCode: jsRenderAdapter.allowCodeInTemplate\n  });\n};\n</pre>\n\n<h3>Customizing workflow engine</h3>\n<p>If you have some specific setting of your workflow engine, you can add template and change them like the following. \n</p>\n\n<pre data-sub=\"prettyprint:_\">\n//the following are jsRender specific settings\njsRenderAdapter.templateDebugMode = false;\njsRenderAdapter.allowCodeInTemplate = true;\n\n//such as\nhm.template.engineAdapter(\"jsrender\").templateDebugMode = true;\nhm.template.engineAdapter(\"jsrender\").allowCodeInTemplate = false;\n</pre>",
        "signatures": []
    },
    {
        "name": "external template",
        "namespace": "plugins",
        "shortDesc": "external template",
        "longDesc": "<h3>Under the hood</h3>\n<p>This plugins allows you to load external template files dynamically, when the template workflow can not resolve a template for a template Id.  This plugin implements <code>hm.template.load()</code> like following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nif (typeof matrix != \"undefined\") {\n   hm.template.load = function( templateId ) {\n   //convert the templateId into the resource Id, that matrix used\n    return matrix( templateId + \".template\" );\n  };\n  matrix.loader.set( \"template\", {                                                   \n                                                                                   \n  load: {                                                                          \n    compile: function( moduleId, sourceCode ) {                                                                                                                       \n      $( sourceCode ).filter( \"script[id]\" ).each( function() {                                                                                                       \n        var $sourceCodeContainer = $( this );                                                                                                                         \n        hm.template.compile(                                                          \n          this.id,                                                                 \n          $sourceCodeContainer.html(),                                             \n          $sourceCodeContainer.attr( \"type\" ) || \n           hm.template.defaultEngine );         \n      } );                                                                         \n    },                                                                             \n    buildDependencies: \"parseDependsTag\"                                           \n  },                                                                               \n                                                                                   \n  url: function( templateId ) {                                                    \n    //first truncate the \".template\" in the templateId, \n     //and get the real templateId\n    return hm.template.templateIdToUrl( matrix.fileName(templateId));              \n  }                                                                                \n} );                                                                                   \n}\n</pre>\n\n<p>We can see that the plugins depends on <a href=\"https://github.com/fredyang/matrix.js\">matrix.js</a>. What the code does is to add a loader named \"template\" to matrix. We can see the loader's compile method call our hm.template.compile, which will call adapter.compile method.\n</p>\n\n<h3>mapping id to template file</h3>\n<p>The first step to load a template is to map the id to the url of a file. The following is a few example of the default mapping. \n</p>\n\n<table class=\"code\">\n<tr><td>Template Id</td><td>Url of template file</td></tr>\n<tr><td colspan=\"2\" style=\"text-align:center\">private templates are in their own folders</td></tr>\n<tr>\n<td>todo</td><td>~todo/main.html</td>\n</tr>\n\n<tr>\n<td>todo.edit</td><td>~todo/edit.html</td>\n</tr>\n\n<tr>\n<td>todo.edit.item</td><td>~todo/edit.html</td>\n</tr>\n\n<tr>\n<td>todo.edit.item.header</td><td>~todo/edit.html</td>\n</tr>\n<tr><td colspan=\"2\" style=\"text-align:center\">common templates are in \"_\" folder</td></tr>\n<tr>\n<td>*msgBox</td><td>~_/msgBox.html</td>\n</tr>\n<tr>\n<td>*msgBox.info</td><td>~_/msgBox.html</td>\n</tr>\n<tr>\n<td>*msgBox.warning</td><td>~_/msgBox.html</td>\n</tr>\n</table>\n\n<p>The \"~\" is the base url of matrix resource, which can be specified like the following</code>\n\n<pre data-sub=\"prettyprint:_\">\nmatrix.baseUrl = \"/matrix_resource/\";\n</pre>\n\n<p>If the default mapping is not the way you want to organize your template file, you should  override this by implementing the following method.</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.template.templateIdToUrl = function (templateId) {\n   //return an url\n};\n</pre>\n<p>Please note that you can put multiple template into a file, when when a file is loaded, all the templates in the file will be compiled, and workflow template will not ask matrix.js to load other templates in the file.</p>\n\n<h3>Example</h3>\n\n<p>\nIn the following demo, the templates are split and hosted by three external files. The hosting is actually a faked by ajaxMock. \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/owahoy/2\">\n\n&lt;!-- template at template/demo/main.html--&gt;\n&lt;script type=\"jsrender\" id=\"demo\"&gt;\n  &lt;div data-sub=\"ns:demo\"&gt;\n    &lt;br data-sub=\"renderSelf:/|*page.header\"/&gt;\n    &lt;br data-sub=\"renderSelf:/|demo.contacts\"/&gt;\n    &lt;br data-sub=\"renderSelf:/|*page.footer\"/&gt;\n  &lt;/div&gt;\n&lt;/script&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n&lt;!-- template at template/_/page.html--&gt;\n&lt;script type=\"jsrender\" id=\"*page.header\"&gt;\n  &lt;header&gt;\n    &lt;h1&gt;Demo Site&lt;/h1&gt;\n  &lt;/header&gt;\n&lt;/script&gt;\n&lt;script type=\"jsrender\" id=\"*page.footer\"&gt;\n  &lt;footer&gt;\n    &lt;address&gt;Contact: &lt;a href=\"mailto:wm@example.com\"&gt;Webmaster&lt;/a&gt;&lt;/address&gt;\n  &lt;/footer&gt;\n&lt;/script&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n&lt;!-- template at template/demo/contacts.html--&gt;\n&lt;script type=\"jsrender\" id=\"demo.contacts\"&gt;\n  &lt;section&gt;\n    &lt;table&gt;\n      &lt;tr&gt;\n        &lt;td&gt;first name&lt;/td&gt;\n        &lt;td&gt;last name&lt;/td&gt;\n      &lt;/tr&gt;\n      &lt;tbody data-sub=\"for:contacts|demo.contacts.rows\"&gt;     &lt;/tbody&gt;\n    &lt;/table&gt;\n  &lt;/section&gt;\n&lt;/script&gt;\n\n&lt;script type=\"jsrender\" id=\"demo.contacts.rows\"&gt;\n  &lt;tr&gt;\n    &lt;td&gt;   {{:firstName}}    &lt;/td&gt;\n    &lt;td&gt;      {{:lastName}}    &lt;/td&gt;\n  &lt;/tr&gt;\n&lt;/script&gt;\n</pre>\n\n<p>We can use render the whole app from an empty body. To be more accurately, the body can render everything underneath by itself using external template.\n</p>\n\n<h3>Pre-load external template</h3>\n<p>Although, template workflow support loading external template on demand, external template don't have to be dynamically loaded. You can pre-load external template, if you know the what templates you need in the application before hand. To load a template file, all you need is to specify the first template in the template file, all the template in the file will be loaded. \nYou must add \".template\" as suffix to the template id, so that what matrix understand it is a template resource. The following pre-load all the template before template workflows starts in the previous example.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/akunaq/1\">\n\n//this will pre-load template/demo/main.html, \n//template/_/page.html, \n//template/demo/contacts.html\nmatrix(\"demo.template, *page.header.template, demo.contacts.template\");\n</pre>\n\n<p>According to some test, the performance of pre-loading template is un-noticeable, especially when html file is cached, plus that you need to know keep track what templates are needed in the application. It is easier to simply to use dynamic template loading.\n</p>",
        "signatures": []
    },
    {
        "name": "App",
        "namespace": "plugins",
        "shortDesc": "App",
        "longDesc": "<p>The App plugin allow you load self-sufficient system into to an container in the page. What \"self-sufficient\" means is that the models can load themselves, the views can render themselves, and the views and models can get along with each others inside the system without the external intervention of any kind.  And this unit is called \"app\". An app can be as big as the whole app attached to document.body, in fact the page your viewing is an app attached to body. \n\nOr it can be small widget inside an element (container).\n</p>\n\n<h3>What an app does?</h3>\n<p>It does two things boostrapping app instances and shutting down app instances.</p>\n<h4>App definition vs App instance</h4>\n<p>App definition is the code to be used for the bootstrapping and shutting down app instance. App instance is the result of bootstrapping, the views and models it create. In the following, when it said \" building app\", it means building app definition. When it is said \"bootstrap an app\", which means creating app instance.\n</p>\n\n<h4>Bootstrapping</h4>\n<p>\nIn <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=plugins.external+template\">external template</a>, we saw an <a href=\"http://jsbin.com/owahoy/2/edit\">example</a> that the view can render itself by fetching the template on dynamically. This is already close to \"self-sufficient\", because the view can render itself. However the view still  depends on model, neither the view can load the model, nor the model can load itself initially. So this is the job of an app, bootstrapping. There are two ways to bootstrapping the an application declaratively or programmatically. \n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.App.bootstrap( appName, viewContainer, modelContainer, options  );\n//example\n//default viewContainer is document.body, \n//modelContainer is root model hm()\nhm.App.bootstrap( \"demo\" );  \n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n&lt;tag data-sub=\"app:modelContainer|appName|options\"&gt;&lt;/tag&gt;\n&lt;!-- example --&gt;\n&lt;body data-sub=\"app:.|demo\"&gt;&lt;/body&gt;\n</pre>\n\n<p>When bootstrapping an app is requested, the following things will happen.</p>\n<ol class=\"list\">\n<li>\nCheck whether the definition of the app is available, if it is available, call the following method. If it is not available, use matrix.js to load it asynchronously. After it is available, call the following method and continue next step, and the real bootstrapping start.\n\n<pre data-sub=\"prettyprint:_\">\napp.bootstrap( viewContainer, modelContainer, options );\n</pre>\n\n\n</li>\n\n<li>Load the root data </li>\n\n<li>Build a model with the root data under the model container so that it will collide with other namespace of repository</li>\n\n<li>Build root view inside view container.  Because it is under a view container, it is possible that we have multiple app instance.\n\n<p>Because of \"finalize\" activity <a href=\"http://localhost/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Template.activities.parseSub\">parseSub</a>, the child views can use declarative subscriptions to build its descendant and interact with model. The app definition also contains code, it can use the code to fetch the more data , build model, and subscriptions, and interact with view.</p></li>\n\n\n<li>Save the app to the root view's private state, so that app cannot be loaded for the same view twice. It is also used for later the root view can respond to unload event by asking the app to shut down the app instance from the view.\n</li>\n\n<li>Increment the instance count of the app,  it can be used for enforce singleton app instance, if it is necessary for a app definition.\n</li>\n</ol>\n\n<h4>shut down</h4>\n\n<p>When an app is not required any more, an app can be shut down by the request from outside or inside of the root container. The default behaviour (over-ridable) does the following thing</p>\n\n<ol class=\"list\">\n <li>empty the view container</li>\n  <li>delete the root model created under the model container</li>\n</ol>\n\n",
        "signatures": []
    },
    {
        "name": "plugins",
        "namespace": "",
        "shortDesc": "plugins",
        "longDesc": "<p>Harmony plugins are some widgets or UI behavior, they are reusable and customizable. One of the reason is that,  all views behave by subscribing the model's events. So there is no encapsulation which limit your ability of customization and extension. You can control the access to model so that you can customize the views behaviour, and you can subscribe the model events to extend plugins, you can replace the widgets with your own by subscribing the events of the built-in model.\n</p>\n\n<p>\nShadow node is often used in Harmony plugins. Shadow node just just like other nodes in repository, they are a node in the repository tree. When you have a node at path <code>person</code>,  you can access its shadow node at path <code>person*</code>.  <code>person</code> here refer to the main node, and <code>person*</code> is the shadow of main node. And shadow node can have their own shadow as well. For example <code>person*</code> shadow is at <code>person**</code>, <code>person*firstName</code>'s shadow is <code>person*firstName*</code>.\n</p>\n\n<p>\nThe shadow node cannot stand alone, it has to be used with its main node. If main node does not exist, it value of shadow node is undefined, and it will throw exception if it is set with a value. When a a main node is created, the shadow node is not created yet. But it will be automatically created the first time it is accessed. When the main node is deleted, shadow node will be automatically deleted, and so for the the shadow of this shadow and so on.\n</p>\n\n<p>\nThe purpose of shadow is to adding some features of main node.\n</p>",
        "signatures": []
    },
    {
        "name": "Async handler",
        "namespace": "Core.Unified Subscription.Subscription.Handler",
        "shortDesc": "Asynchronous handler",
        "longDesc": "<p>Asynchronous handler is a handler with async activities. A async activity does not return a value such as string, number immediately, instead it returns a jQuery promise object, which promises to return the value your expect. Harmony supports \"get\" and \"convert\" activity to return promise. When you compose an workflow with handlers, you don't need to care whether an activity is sync or async, because Harmony will take care of the connection between them. For example, if you compose an async \"get\" , and a \"set\", you don't need do any special handling in the \"set\",  it will always receive the value it expects, but not a promise. If a get activity return a jQuery jqXHR,  which is jQuery promise, the \"set\" will have receive the data that jqXHR promise.\n\n<p>The following example use a handler with all four activities, including, an async \"get\", an async \"convert\". You need to click a button complete an activity is completed, so it is async. This is quite lengthy demo, for easy viewing, please click on the edit code button, to view it in jsbin. The following just shows the part of the handler.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ivotib/2\">\nasyncHandler: {\n\n  get: function (e) {\n    hm.log(\"'get' started, waiting response...\");\n    deferredGet = $.Deferred();\n    model.set(\"state.status\", \"get\");\n    return deferredGet.promise();\n  },\n\n  convert: function (value, e) {\n    hm.log(\"'convert' receive value from 'get': \" + value + \", waiting response...\");\n    deferredConvert = $.Deferred();\n    model.set(\"state.status\", \"convert\");\n    return deferredConvert.promise();\n  },\n\n  set: function (value, e) {\n    model.set(\"state.result\", value);\n    hm.log(\"'set' receive value from 'convert': \" + value);\n  },\n\n  finalize: function (value, e) {\n    hm.log(\"'finalize' receive value from 'set': \" + value);\n    model.set(\"state.status\", \"stopped\");\n    deferredGet = null;\n    deferredConvert = null;\n\n  }\n\n}\n</pre>",
        "signatures": []
    },
    {
        "name": "triggerChange",
        "namespace": "Core.Unified Subscription.Utilities",
        "shortDesc": "node.triggerChange()",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.triggerChange([subPath])",
                "returns": "node",
                "shortDesc": "trigger a \"afterUpdate\" event to a node.",
                "desc": "It is a shortcut of triggering a \"afterUpdate\" event to a node",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.triggerChange(subPath)",
                        "parameters": [
                            {
                                "name": "[subPath]",
                                "type": "string",
                                "desc": "optional, sub-path relative to the node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "debugging",
        "namespace": "Core.Unified Subscription.Utilities",
        "shortDesc": "debugging",
        "longDesc": "<p>\nThere are a couple debugging functions that help you to see what subscriptions has been created for model or view,  they are only for debugging purpose, and it might be removed in the future release.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n//the obj might be a jQuery object or model node\n//subscriptions in which the object is publisher\nsubscriptions = obj.subsToMe(); \n//\n//subscriptions in which the object is subscriber,\nsubscriptions = obj.subsFromMe(); \n//\n//subscriptions in which the object is either publisher or subscriber\nsubscriptions = obj.subscriptions(); \n</pre>",
        "signatures": []
    },
    {
        "name": "onDeleteNode",
        "namespace": "Core.Repository",
        "shortDesc": "onDeleteNode",
        "longDesc": "<p>\nThe function's signature is \n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction ( physicalPath, removedValue ) {\n\n}\n</pre>",
        "signatures": [
            {
                "name": "hm.onDeleteNode(fn)",
                "returns": "hm",
                "shortDesc": "add a function to be called back when node is deleted",
                "desc": "",
                "overloads": [],
                "examples": []
            }
        ]
    },
    {
        "name": "onAddOrUpdateNode",
        "namespace": "Core.Repository",
        "shortDesc": "onAddOrUpdateNode",
        "longDesc": "",
        "signatures": []
    },
    {
        "name": "value adapter",
        "namespace": "Core",
        "shortDesc": "value adapter",
        "longDesc": "<p>In html, there are some elements, such \"input\", \"select\" whose purpose is to capture user's input.  We also want to connect these elements to model, so user's input will be transfer to a node. Although it is possible to use subscription such as <code>data-sub=\"$change:path|val;!init afterUpdate:path|val\"</code> to do the job, it is not easy to use. Harmony has a \"val\" subscription group to solve this problem. This group create one or two subscription between a element and a model node. So that they model can be updated when element change, optionally, element will be updated when model changes. The following examples is simple domo, it also shows how to create and use a custom value adapter \"date\".\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ejulal/1\">\n\n\n&lt;form data-sub=\"ns:myapp.profile;resetFormValues:.\"&gt;\n  &lt;label&gt;&lt;b&gt;Name:&lt;/b&gt;\n    &lt;input type=\"text\" data-sub=\"val:name\"&gt;\n  &lt;/label&gt;\n  &lt;label&gt;&lt;b&gt;Date of Birth:&lt;/b&gt;\n    &lt;input type=\"text\" data-sub=\"val:dateOfBirth|,,date\"&gt;&lt;/label&gt;\n  &lt;label&gt;&lt;b&gt;Language &lt;br&gt; (ctrl + click to select multiple):&lt;/b&gt;\n    &lt;br/&gt;\n    &lt;select multiple data-sub=\"\n         options:..lookupData.languages;\n         val:languages\"&gt;&lt;/select&gt;\n  &lt;/label&gt;\n  &lt;label&gt;&lt;b&gt;Major:&lt;/b&gt;\n    &lt;select data-sub=\"\n           caption:_|-------------;\n           options:..lookupData.majors;\n           val:major\"&gt;&lt;/select&gt;\n  &lt;/label&gt;\n  &lt;div class=\"label\"&gt;&lt;b&gt;Gender:&lt;/b&gt;\n    &lt;label class=\"normal\"&gt;\n      &lt;input type=\"radio\" data-sub=\"val:accept\" value=\"male\"&gt;Male&lt;/label&gt;&amp;nbsp; &amp;nbsp;\n    &lt;label class=\"normal\"&gt;\n      &lt;input type=\"radio\" data-sub=\"val:accept\" value=\"female\"&gt;Female&lt;/label&gt;\n  &lt;/div&gt;\n  &lt;div class=\"label\"&gt;&lt;b&gt;&lt;/b&gt;\n    &lt;label class=\"normal\"&gt;\n      &lt;input type=\"checkbox\" data-sub=\"val:accept\"&gt;Accept terms?&lt;/label&gt;\n  &lt;/div&gt;\n  &lt;label&gt;\n    &lt;b&gt;&lt;/b&gt;\n    &lt;button&gt;Submit&lt;/button&gt;\n    &lt;button type=\"reset\"&gt;reset&lt;/button&gt;\n  &lt;/label&gt;\n&lt;/form&gt;\n</pre>",
        "signatures": [
            {
                "name": "val:path[|[updateEvent],[updateDirection][,adapterName]]",
                "returns": "",
                "shortDesc": "building subscriptions between a view and a model so that a view's value and model's value can be synchronized.",
                "desc": "<p>In a lot of case, you can use the default format like <code>val:path</code> , but you can fine tune your choice in certain case. Here are a couple other possible usages<br>\n<code>val:path|keypress</code><br>\n<code>val:path|,updateModel</code><br>\n<code>val:path|,updateView</code><br>\n<code>val:path|,,date</code><br>\n<code>val:path|updateEvent,updateDirection,adapterName</code>\n</p>",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "val:path[|[updateEvent],[updateDirection][,adapterName]]",
                        "parameters": [
                            {
                                "name": "updateEvent",
                                "type": "string",
                                "desc": "optional, by default it is \"change\" event, other values can be \"keyup\" etc."
                            },
                            {
                                "name": "updateDirection",
                                "type": "string",
                                "desc": "optional, by default it is empty,  acceptable values are \"updateModel\" meaning \"only view update model\", \"updateView\" meaning \"only model update view\", empty string meaning \"update both ways\".  "
                            },
                            {
                                "name": "adapterName",
                                "type": "string",
                                "desc": "optional, default value is empty, which means let Harmony automatic pick a value adapter for you. Specify it, if you know the adapter name."
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "custom adapter",
        "namespace": "Core.value adapter",
        "shortDesc": "custom value adapter",
        "longDesc": "<p>In a lot of case, Harmony can pick a right adapter for you when you use \"val\" subscription group. But if you want to a value from input control before saving back to model, or you want to use third party widget to capture user's input. You need create your own value adapters, however it is relatively easy task. A adapter is like the following object.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar adapter = {\n  //optional if match function is present\n  name: \"adapterName\",\n  //\n  //optional if name is present\n  match: function ($elem) {\n    return true;\n  },\n  //\n  //prepare $element\n  initialize: function ($elem) {}\n  //\n  //get a value from element\n  get: function ($elem) {},\n  //\n  //set a value to $element\n  set: function ($elem, value, e) {},\n  //\n  //optional, if get function already convert, you don't need this\n  //object is a string \"*commonConvertActivityName\" or \n  //function (value) {}\n  convert: object \n};\n\nhm.valueAdapter(adapter);\n</pre>\n\n<p>\nThe following is an adapter that use jQuery UI datepicker as input control. \n</p>\n<pre data-sub=\"prettyprint:_\">\nhm.valueAdapter({\n  name: \"date\",\n  initialize: function ($elem) {\n    $elem.datepicker({\n      onSelect: function (dateText, instance) {\n        $(this).trigger(\"change\");\n      }\n    });\n  },\n  //get value from view and set the model\n  get: function ($elem) {\n    return $elem.datepicker(\"getDate\");\n\n  },\n  //get value from model and set the view\n  set: function ($elem, value, e) {\n    if (+$elem.datepicker(\"getDate\") != +value) {\n      $elem.datepicker(\"setDate\", value);\n    }\n  }\n});\n</pre>\n\n<p>\nBecause the adapter does not have does not have a match function, when you use it in \"val\" subscription group, Harmony can use the match function to locate the adapter. So you have to specify the adatper's name in \"val\" group syntax, like the following\n</p>\n<pre data-sub=\"prettyprint:_;\">\n&lt;input type=\"val:dateOfBirth|,,date\" &gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/isifux/1\">\n&lt;body data-sub=\"ns:myapp\"&gt;\n  &lt;p&gt;\n    &lt;label&gt;Date of Birth:\n      &lt;input type=\"text\" data-sub=\"val:dateOfBirth|,,date\"&gt;\n  &lt;/p&gt;\n  &lt;p&gt;\n    &lt;input type=\"button\" value=\"Reset\" data-sub=\"$click:setToday\"&gt;\n  &lt;/p&gt;\n  &lt;p data-sub=\"dump:.\"&gt;&lt;/p&gt;\n&lt;/body&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_;\">\nhm(\"myapp\", {\n  dateOfBirth: new Date(),\n  setToday: function (e) {\n   e.subscriber.set(\"..dateOfBirth\", new Date()); \n  }\n});\n</pre>",
        "signatures": []
    },
    {
        "name": "Basic Subscriptions",
        "namespace": "Core",
        "shortDesc": "Basic Subscriptions",
        "longDesc": "<p>Harmony includes lots small, handy subscription groups.  A lot of them use a workflow type of the same name of the subscription groups. You can use these workflow types of with other event names. Here a list of them.\n</p>\n\n<table>\n <tr>\n    <td>group name</td>\n    <td>definition</td>\n    <td>functions</td>\n<tr>\n <tr>\n <tr>\n    <td>html</td>\n    <td class=\"code\">!init after*:.|get html *toString</td>\n  <td>change the html of element initially and when model change</td>\n</tr>\n <tr>\n    <td>text</td>\n    <td class=\"code\">!init after*:.|get text *toString</td>\n  <td>change the text of element initially and when model change.</td>\n</tr>\n    <td>options</td>\n    <td class=\"code\">!init after*:.|*options</td>\n    <td>populate option list of select element initially and after model change</td>\n<tr>\n <tr>\n    <td>caption</td>\n    <td class=\"code\">dynamic group</td>\n  <td>specify the first option of select element initially and after model change</td>\n</tr>\n <tr>\n    <td>show</td>\n    <td class=\"code\">!init after*:.|*show</td>\n    <td>show an element initially and after model change</td>\n</tr>\n </tr>\n    <td>hide</td>\n    <td class=\"code\">!init after*:.|*hide</td>\n    <td>hide an element initially and after model change</td>\n</tr>\n <tr>\n    <td>enable</td>\n    <td class=\"code\">!init after*:.|*enable</td>\n  <td>enable an element initially and after model change</td>\n</tr>\n<tr>\n    <td>enableLater</td>\n    <td class=\"code\">!after*:.|*enable</td>\n  <td>enable an element after model change</td>\n</tr>\n <tr>\n    <td>disable</td>\n    <td class=\"code\">!init after*:.|*disable</td>\n  <td>disable an elmenet</td>\n</tr>\n<tr>\n    <td>disableLater</td>\n    <td class=\"code\">!after*:.|*disable</td>\n  <td>disable an element after model change</td>\n</tr>\n <tr>\n    <td>addClass</td>\n    <td class=\"code\">!init after*:.|*addClass</td>\n  <td>add a class to an element initially and after model change</td>\n</tr>\n <tr>\n    <td>removeClass</td>\n    <td class=\"code\">!init after*:.|*removeClass</td>\n  <td>remove a class to an element initially and after model change</td>\n</tr>\n <tr>\n    <td>focus</td>\n    <td class=\"code\">!init after*:.|*focus</td>\n  <td>focus on an element initially and after model change</td>\n</tr>\n <tr>\n    <td>count</td>\n    <td class=\"code\">!init after*:.|*count</td>\n  <td>show the length of an array node initially and after model change</td>\n</tr>\n <tr>\n    <td>dump</td>\n    <td class=\"code\">!init *:.|*dump</td>\n  <td>print the value of a model initially and after model change</td>\n</tr>\n <tr>\n    <td>alert</td>\n    <td class=\"code\">$click:.|*alert</td>\n  <td>alert a message when click</td>\n</tr>\n <tr>\n    <td>preventDefault</td>\n    <td class=\"code\">$click:_|*preventDefault</td>\n  <td>prevent default action when click</td>\n</tr>\n <tr>\n    <td>confirm</td>\n    <td class=\"code\">$click:.|*confirm</td>\n  <td>alert a confirm message box when click</td>\n</tr>\n <tr>\n    <td>hardCode</td>\n    <td class=\"code\">$click:.|*hardCode</td>\n  <td>set model to a fixed value when click</td>\n</tr>\n<tr>\n    <td>0</td>\n    <td class=\"code\">$click:.|*0</td>\n  <td>set model to 0 when click</td>\n</tr>\n <tr>\n    <td>null</td>\n    <td class=\"code\">$click:.|*null</td>\n  <td>set model to null when click</td>\n</tr>\n <tr>\n    <td>true</td>\n    <td class=\"code\">$click:.|*true</td>\n  <td>set model to true when click</td>\n</tr>\n <tr>\n    <td>false</td>\n    <td class=\"code\">$click:.|*false</td>\n  <td>set a model to false when click</td>\n</tr>\n <tr>\n    <td>toggle</td>\n    <td class=\"code\">$click:.|*toggle</td>\n  <td>flip a model value when click</td>\n</tr>\n <tr>\n    <td>++</td>\n    <td class=\"code\">$click:.|*++</td>\n  <td>increment a model when click</td>\n</tr>\n <tr>\n    <td>--</td>\n    <td class=\"code\">$click:.|*--</td>\n  <td>decrement a model when click</td>\n</tr>\n\n\n <tr>\n    <td>sort</td>\n    <td class=\"code\">$click:.|*sort</td>\n  <td>sort a value when click</td>\n</tr>\n <tr>\n    <td>clear</td>\n    <td class=\"code\">$click:.|*clear</td>\n  <td>clear the items of array when click</td>\n</tr>\n\n <tr>\n    <td>autofocus</td>\n    <td class=\"code\">dynamic group</td>\n  <td>auto-focus an element when load</td>\n</tr>\n <tr>\n    <td>mapEvent</td>\n    <td class=\"code\">dynamic group</td>\n  <td>raise a new event when an event triggered to an element</td>\n</tr>\n <tr>\n    <td>logPanel</td>\n    <td class=\"code\">dynamic group</td>\n  <td>show the message that hm.log() output</td>\n</tr>\n <tr>\n    <td>clearlog</td>\n    <td class=\"code\">clear:/*log</td>\n  <td>clear the items of *log model</td>\n</tr>\n\n <tr>\n    <td>cacheable</td>\n    <td class=\"code\">dynamic group</td>\n  <td>cache a model initially and after it change</td>\n</tr>\n</table>",
        "signatures": []
    },
    {
        "name": "html/text",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "html/text",
        "longDesc": "<p>The definition of \"html\" subscription group is <code>!init after*:.|get html *toString</code>. It can use model's value to update element's html content initially and when model change.  The definition of \"text\" subscription group is <code>!init after*:.|get text *toString</code>. It can use model's value to update element's text initially and when model change. \n</p>",
        "signatures": []
    },
    {
        "name": "options",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "options",
        "longDesc": "<p>You can use subscription group \"options\" and workflow type \"groups\" to fill the options of a \"select\" element. The group also can respond to the change of model to refresh the element.  Here is the syntax:\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n//using group\noptions:path[|textProperty,[idProperty]]\n//using workflow type\n!events:path|*options[|textProperty[,idProperty]]\n</pre>\n\n<h3>Example</h3>\n\n<pre data-sub==\"prettyprint:_;preview:_|http://jsbin.com/imijak/1\">\n&lt;body&gt;\n  &lt;div data-sub=\"ns:demo\"&gt;\n     &lt;h2&gt;simple lookup&lt;/h2&gt;\n\n    &lt;select data-sub=\"options:fruit;debug:_\"&gt;&lt;/select&gt;\n    &lt;button data-sub=\"clear:fruit\"&gt;clear lookup&lt;/button&gt;\n    &lt;button data-sub=\"$click:addFruit\"&gt;add lookup fruit&lt;/button&gt;\n    &lt;hr /&gt;\n     &lt;h2&gt;complex lookup&lt;/h2&gt;\n\n    &lt;select data-sub=\"options:products|name,id;debug:_\"&gt;&lt;/select&gt;\n    &lt;button data-sub=\"clear:products\"&gt;clear lookup&lt;/button&gt;\n    &lt;button data-sub=\"$click:addProducts\"&gt;add lookup fruit&lt;/button&gt;\n    &lt;hr&gt;\n    &lt;div data-sub=\"dump:.\"&gt;&lt;/div&gt;\n    &lt;hr&gt;\n    &lt;div data-sub=\"logPanel:.\"&gt;&lt;/div&gt;\n  &lt;/div&gt;\n&lt;/body&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\nhm(\"demo\",\n\n{\n  fruit: [\"apple\", \"orange\", \"banana\"],\n  addFruit: function (e) {\n    e.subscriber.cd(\"..fruit\").push(\"fruit \" + (++fruitCount));\n\n  },\n  selectedFruit: null,\n  products: [{\n    id: 1001,\n    name: \"keyboard\"\n  }, {\n    id: 1002,\n    name: \"mouse\"\n  }, {\n    id: 1003,\n    name: \"Camera\"\n  }],\n  addProducts: function (e) {\n    productId++;\n    e.subscriber.cd(\"..products\").push({\n      id: productId,\n      name: \"product \" + productId\n    });\n  }\n}\n\n\n);\n\nvar fruitCount = 3;\nvar productId = 1003;\n</pre>",
        "signatures": []
    },
    {
        "name": "caption",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "caption",
        "longDesc": "<p>\nThis subscription group add a caption to \"select\" element. It does not really create The syntax is as following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n//the path is \"_\", meaning there is no subscriber.\ncaption:_|captionText\n//or\ncaption:pathOfCaptionText\n</pre>\n\n<h3>Example</h3>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/efopej/2\">\n\n\n&lt;select data-sub=\"caption:_|--pick one ---;options:fruits\"&gt;\n  &lt;/select&gt;\n  \n  &lt;select data-sub=\"caption:embeddedCaption;options:fruits\"&gt;\n  &lt;/select&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\nhm(\"fruits\", [\"apple\", \"orange\", \"banana\"]);\nhm(\"embeddedCaption\", \"--embedded caption--\");\n</pre>",
        "signatures": []
    },
    {
        "name": "show/hide",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "show/hide",
        "longDesc": "<p>The \"show\" subscription group and workflow type will show the element when model value is truthy, otherwise hide the element.  The model value can be a simple value like string, integer, or it can be a function, in this case the value of function call is evaluated. You can also add an options to create an expression, when the expression is true, show the element, otherwise hide the element. The \"hide\" counterpart will do the opposite. The following is the syntax.\n<p>\n\n<pre data-sub=\"prettyprint:_\">\n//\nshow:path\nshow:path|value\nshow:path|expression \n//\nhide:path\nhide:path|value\nhide:path|expression \n</pre>\n<h3>Example</h3>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/amuvuz/2\">\n &lt;div data-sub=\"ns:demo\"&gt;\n       &lt;h4&gt;simple model, no expression&lt;/h4&gt;\n\n      &lt;div&gt;\n        &lt;button data-sub=\"show:visible;false:visible\"&gt;hide&lt;/button&gt;\n        &lt;button data-sub=\"hide:visible;true:visible\"&gt;show&lt;/button&gt; &lt;span data-sub=\"show:visible\"&gt;Hello world&lt;/span&gt;\n\n      &lt;/div&gt;\n      &lt;table&gt;\n        &lt;col style=\"width:300px\"&gt;\n          &lt;tr&gt;\n            &lt;td&gt;\n               &lt;h4&gt;\"equal\" expression&lt;/h4&gt;\n\n              &lt;div data-sub=\"show:selectedNumber|1\"&gt;number 1&lt;/div&gt;\n              &lt;div data-sub=\"show:selectedNumber|2\"&gt;number 2&lt;/div&gt;\n              &lt;div data-sub=\"show:selectedNumber|3\"&gt;number 3&lt;/div&gt;\n              &lt;div data-sub=\"show:selectedNumber|4\"&gt;number 4&lt;/div&gt;\n              &lt;div data-sub=\"show:selectedNumber|5\"&gt;number 5&lt;/div&gt;\n               &lt;h4&gt;complex expression&lt;/h4&gt;\n\n              &lt;div data-sub=\"show:selectedNumber|&gt;3\"&gt;you can see this because it is over 3&lt;/div&gt;\n               &lt;h4&gt;function model&lt;/h4&gt;\n\n              &lt;div data-sub=\"show:tooBig\"&gt;you can see this because it is too big&lt;/div&gt;\n            &lt;/td&gt;\n            &lt;td&gt;\n              &lt;select data-sub=\"caption:_|--number--;val:selectedNumber;options:numbers\"&gt;&lt;/select&gt;\n            &lt;/td&gt;\n      &lt;/table&gt;\n    &lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n hm(\"demo\", {\n    visible: true,\n    selectedNumber: \"\",\n    numbers: [1, 2, 3, 4, 5],\n    tooBig: function () {\n     return this.get(\"selectedNumber\") > 4; \n    }\n  });\n</pre>",
        "signatures": []
    },
    {
        "name": "enable/disable",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "enable/disable",
        "longDesc": "<p>The \"enable\" subscription group and workflow type will enable the element when model value is truthy, otherwise disable the element.  The model value can be a simple value like string, integer, or it can be a function, in this case the value of function call is evaluated. You can also add an options to create an expression, when the expression is true, enable the element, otherwise hide the element. The \"disable\" counterpart will do the opposite. The following is the syntax.\n<p>\n\n<pre data-sub=\"prettyprint:_\">\n//\nenable:path\nenable:path|value\nenable:path|expression \n//\ndisable:path\ndisable:path|value\ndisable:path|expression \n</pre>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ojuxec/1\">\n &lt;h3&gt;no expression&lt;/h3&gt;\n\n&lt;button data-sub=\"enable:done;false:done;debug:_\"&gt;start&lt;/button&gt;\n&lt;button data-sub=\"disable:done;true:done;debug:_\"&gt;stop&lt;/button&gt;\"done\": &lt;span data-sub=\"text:done\"&gt;&lt;/span&gt;\n\n &lt;h3&gt;expression&lt;/h3&gt;\n\n&lt;button data-sub=\"enable:count|&lt;5;++:count;debug:_\"&gt;up&lt;/button&gt;\n&lt;button data-sub=\"disable:count|0;--:count;debug:_\"&gt;down&lt;/button&gt;\"count\": &lt;span data-sub=\"text:count\"&gt;&lt;/span&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\nhm(\"demo\", {\n    done: true,\n    count: 3  \n  });\n</pre>",
        "signatures": []
    },
    {
        "name": "(add/remove)Class",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "(add/remove)Class",
        "longDesc": "<p>The \"addClass\" subscription group and workflow type will add a CSS class to the element when model value is truthy, otherwise remove the class from the element.  The model value can be a simple value like string, integer, or it can be a function, in this case the value of function call is evaluated. You can also add an options to create an expression, when the expression is true, add the class to the element, otherwise remove the class from the element. The \"remove\" counterpart will do the opposite. The following is the syntax.\n<p>\n\n<pre data-sub=\"prettyprint:_\">\n//\naddClass:path|className\naddClass:path|className,value\naddClass:path|className,expression \n//\nremoveClass:path|className\nremoveClass:path|className,value\nremoveClass:path|className,expression \n</pre>\n\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ojuxec/4\">\n&lt;div data-sub=\"ns:demo\"&gt;\n   &lt;h3&gt;no expression&lt;/h3&gt;\n\n  &lt;button data-sub=\"enable:done;false:done\"&gt;start&lt;/button&gt;\n  &lt;button data-sub=\"disable:done;true:done\"&gt;stop&lt;/button&gt;\"done\": &lt;span data-sub=\"text:done\"&gt;&lt;/span&gt;  &lt;span data-sub=\"removeClass:done|pending;debug:_\"&gt;&lt;/span&gt;\n\n   &lt;h3&gt;expression&lt;/h3&gt;\n\n  &lt;button data-sub=\"++:temperature\"&gt;up&lt;/button&gt;\n  &lt;button data-sub=\"--:temperature\"&gt;down&lt;/button&gt;\"temperature\": &lt;span data-sub=\"text:temperature\"&gt;&lt;/span&gt;\n\n  &lt;span\n  data-sub=\"addClass:temperature|hot,&gt;23;debug:_\"&gt;&lt;/span&gt;\n&lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n hm(\"demo\", {\n    done: true,\n    temperature: 23  \n  });\n</pre>",
        "signatures": []
    },
    {
        "name": "count",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "count",
        "longDesc": "<p>The \"count\" subscription group can update the length of array node.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/obayes/1\">\n&lt;div data-sub=\"ns:demo\"&gt;\n    &lt;button data-sub=\"$click:addItems\"&gt;add items&lt;/button&gt;\n    You have &lt;span data-sub=\"count:items\"&gt;&lt;/span&gt; item&lt;span data-sub=\"show:plural\"&gt;s&lt;/span&gt;\n    &lt;div data-sub=\"dump:items\"&gt;&lt;/div&gt;\n  &lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n var i = 1;\n  hm(\"demo\", {\n    items: [],\n    addItems: function (e) {\n      e.subscriber.cd(\"..items\").push(i++);\n    },\n    plural: function() {\n      return this.get(\"items\").length > 1; \n    }\n  });\n</pre>",
        "signatures": []
    },
    {
        "name": "focus",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "focus",
        "longDesc": "<p>\n\"focus\" is an subscription group which will focus on an element when the model is truthy or an expression is evaluated to by truthy. The syntax is as follow:\n</p>\n<pre data-sub=\"prettyprint:_\">\n//\nfocus:path\nfocus:path|value\nfocus:path|expression \n</pre>\n<p>\nThe following shows an text box auto focus itself, when model change to true.\n</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/azokix/1\">\n&lt;div data-sub=\"ns:demo\"&gt;\n  &lt;div data-sub=\"hide:editMode\"&gt;\n    &lt;button data-sub=\"true:editMode\"&gt;switch to edit mode&lt;/button&gt;\n    &lt;div data-sub=\"html:article\"&gt;&lt;/div&gt;\n  &lt;/div&gt;\n  &lt;div data-sub=\"show:editMode\"&gt;\n    &lt;textarea rows=\"10\" cols=\"50\" data-sub=\"val:article;focus:editMode;debug:_\"&gt;&lt;/textarea&gt;\n    &lt;br /&gt;\n    &lt;button data-sub=\"false:editMode;\"&gt;Done&lt;/button&gt;\n  &lt;/div&gt;\n&lt;/div&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "Subscription to click",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "Subscription to \"click\" event",
        "longDesc": "<p>Harmony has a few subscription groups and workflow types for view event \"click\".  All these subscription groups use the same name of their workflow type. For example,  subscription group <code>null</code> is defined as <code>$click:.|*null</code></p>\n</p>\n\n<table>\n<tr>\n<td>name</td>\n<td>side effect</td>\n<td>syntax</td>\n</tr>\n\n<tr>\n<td>alert</td>\n<td>alert a message</td>\n<td class=\"code\">alert:path\n<br>\nalert:_|message\n</td>\n</tr>\n\n<tr>\n<td>confirm</td>\n<td>confirm with a message</td>\n<td class=\"code\">\nconfirm:path\n<br>\nconfirm:_\n<br>\nconfirm:_|message\n</td>\n</tr>\n\n<tr>\n<td>null</td>\n<td>set model to null</td>\n<td class=\"code\">null:path</td>\n</tr>\n\n<tr>\n<td>hardCode</td>\n<td>set a fixed value to model</td>\n<td class=\"code\">hardCode:path|fixedValue</td>\n</tr>\n<tr>\n<td>true</td>\n<td>set model to true</td>\n<td class=\"code\">true:path</td>\n</tr>\n\n<tr>\n<td>false</td>\n<td>set model to false</td>\n<td class=\"code\">false:path</td>\n</tr>\n<tr>\n<td>toggle</td>\n<td>flip model's value</td>\n<td class=\"code\">toggle:path</td>\n</tr>\n\n\n<tr>\n<td>++</td>\n<td>increment model by 1</td>\n<td class=\"code\">++:path</td>\n</tr>\n<tr>\n<td>--</td>\n<td>decrement model by 1</td>\n<td class=\"code\">--:path</td>\n</tr>\n\n<tr>\n<td>sort</td>\n<td>set model</td>\n<td class=\"code\">sort:path  <br> sort:path|colName  <br> sort:path|colName,false\n</td>\n</tr>\n\n<tr>\n<td>clear</td>\n<td>clear all items of model</td>\n<td  class=\"code\">clear:path</td>\n</tr>\n</table>\n\n<h3>Examples</h3>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ejefor/2\">\n&lt;table data-sub=\"ns:demo\"&gt;\n  &lt;tr&gt;\n    &lt;td&gt;group/workflow name&lt;/td&gt;\n    &lt;td&gt;action&lt;/td&gt;\n    &lt;td&gt;side effect&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;alert&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"alert:message\"&gt;alert&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td data-sub=\"dump:message\"&gt;&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;confirm&lt;/td&gt;\n    &lt;td&gt;\n      &lt;a href=\"http://google.com\" data-sub=\"confirm:confirm\"&gt;confirm&lt;/a&gt;\n    &lt;/td&gt;\n    &lt;td data-sub=\"dump:confirm\"&gt;&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;confirm&lt;/td&gt;\n    &lt;td&gt;\n      &lt;a href=\"http://google.com\" data-sub=\"preventDefault:_\"&gt;no action&lt;/a&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;null&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"null:message\"&gt;set null&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td data-sub=\"dump:message\"&gt;&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;hardCode&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"hardCode:message|hello\"&gt;set 'hello'&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td data-sub=\"dump:message\"&gt;&lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;true&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"true:boolean\"&gt;set true&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:boolean\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;false&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"false:boolean\"&gt;set false&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:boolean\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;toggle&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"toggle:boolean\"&gt;toogle&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:boolean\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;++&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"++:count\"&gt;++&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:count\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;--&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"--:count\"&gt;--&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:count\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;sort&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"sortItems:numbers\"&gt;sort number&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:numbers\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;sort&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"sortItems:objects|id\"&gt;sort objects&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:objects\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n  &lt;tr&gt;\n    &lt;td&gt;clear&lt;/td&gt;\n    &lt;td&gt;\n      &lt;button data-sub=\"clear:items\"&gt;clear&lt;/button&gt;\n    &lt;/td&gt;\n    &lt;td&gt;&lt;span data-sub=\"dump:items\"&gt;&lt;/span&gt;\n\n    &lt;/td&gt;\n  &lt;/tr&gt;\n&lt;/table&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "autofocus",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "autofocus",
        "longDesc": "<p>This a dynamic group, it does not create any subscription. However, it make the element focus after page load.\n</p>\n\n<h3>Example</h3>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/oqamor/1\">\n\n\n    &lt;input type=\"text\" data-sub=\"autofocus:_\" &gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "mapEvent",
        "namespace": "Core.Basic Subscriptions",
        "shortDesc": "mapEvent, mapClick",
        "longDesc": "<p>\"mapEvent\" is dynamic subscription group.  It is syntax is as follow\n</p>\n\n<pre data-sub=\"prettyprint:_;\">\nmapEvent:_|originalEvent,newEvent\n//e.g\nmapEvent:_|click,delete\n</pre>\n\n<p>\n\"mapClick\" is short-cut of mapEvent, you can use <code>mapClick:_|delete</code> for <code>mapEvent:_|click,delete</code>\n</p>\n\n<p>This subscription group create an binding to the original event, when the original event trigger, trigger the new event to the element. This useful for certain case. For example, you have lots of elements which generate \"click\" event, and you want to listen to these event, instead of binding handler to all these elements, you bind handler to their parent, however,  you only need use different logic for different kind of elements. So your handler will be have lots of switch or if/else. The following shows how to use mapEvent subscription group to solve this problem.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/iqekup/1\">\n&lt;div data-sub=\"ns:demo;\n      $delete:processDelete;\n      $edit:processEdit;\n      $cancel:processCancel\"&gt;\n  &lt;button data-sub=\"mapEvent:_|dblclick,edit\"&gt;double click to edit&lt;/button&gt;\n  &lt;button data-sub=\"mapClick:_|cancel\"&gt;click to cancel&lt;/button&gt;\n  &lt;button data-sub=\"mapEvent:_|ctrlclick,delete\"&gt;ctrl+ click to delete&lt;/button&gt;\n&lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_;\">\nhm(\"demo\", {\n  processDelete: function (e) {\n    hm.log(\"process delete\");\n  },\n  processEdit: function (e) {\n    hm.log(\"process edit\");\n  },\n  processCancel: function (e) {\n    hm.log(\"process cancel\");\n  }\n});\n</pre>\n",
        "signatures": []
    },
    {
        "name": "cacheable",
        "namespace": "Core.Repository.Node.LocalStorage",
        "shortDesc": "node.cacheable([subPath])",
        "longDesc": "",
        "signatures": [
            {
                "name": "node.cacheable(subPath)",
                "returns": "hm",
                "shortDesc": "",
                "desc": "automatic cache the node value when the node is changed",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.cacheable([subPath])",
                        "parameters": [
                            {
                                "name": "subPath",
                                "type": "string",
                                "desc": "optional, sub-path relative to the current node"
                            }
                        ]
                    }
                ],
                "examples": []
            }
        ]
    },
    {
        "name": "listView",
        "namespace": "plugins",
        "shortDesc": "listView",
        "longDesc": "<p>\"listView\" is a subscription group that allow you to display array model in a list just like group \"forAll\", \"forChild\", \"forSelf\". Unlike them, it is more efficient in that it can update only the row of the view where the item which mapped to the row is changed.\n</p>\n\n<h3>Example</h3>\n<p>In the following example shows, clicking the button will manipulate the items in an array node, the list view can update the rows effected, but rows,  which are not affected, are not re-rendered.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ogesaq/2\">\n&lt;div data-sub=\"ns:demo\"&gt;\n  &lt;button data-sub=\"$click:updateFirstContact\"&gt;update first contact&lt;/button&gt;\n  &lt;button data-sub=\"$click:moveRow\"&gt;move row 2 to 3&lt;/button&gt;\n  &lt;br&gt;\n  &lt;button data-sub=\"$click:addNewContact\"&gt;add new contact&lt;/button&gt;\n  &lt;button data-sub=\"$click:removeLastContact\"&gt;remove last contact&lt;/button&gt;\n  &lt;table&gt;\n    &lt;tbody data-sub=\"listView:contacts|contact\"&gt;&lt;/tbody&gt;\n  &lt;/table&gt;\n&lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n var i = 1;\n \n  var model = hm(\"demo\", {\n    contacts: [\n      { firstName: \"Jane\", lastName: \"Poe\"},\n      { firstName: \"Robert\", lastName: \"Roe\"},\n      { firstName: \"Brett\", lastName: \"Boe\"},\n      { firstName: \"Carla\", lastName: \"Coe\"},\n      { firstName: \"Donna\", lastName: \"Doe\"},\n      { firstName: \"Juan\", lastName: \"Doe\"}\n      ],\n    updateFirstContact: function (e) {\n      i++;\n      model.cd(\"contacts\").update(0, {\n        firstName: \"Jane\" + i, lastName: \"Poe\" + i\n      });\n     \n    },\n     addNewContact: function (e) {\n        i++;\n        model.cd(\"contacts\").push({\n          firstName: \"firstName\" + i, lastName : \"lastName\" + i\n          \n        });\n        \n      },\n    removeLastContact: function (e) {\n     model.cd(\"contacts\").pop();\n    \n    },\n    moveRow: function (e) {\n      model.cd(\"contacts\").move(1, 2);\n    }\n  \n  });\n  hm(\"*ts\", true);\n</pre>\n<h3>listView group details</h3>\n<table>\n<tr><th>group syntax</th><th  class=\"code\">listView:pathOfArray|idOfRowTemplate</th></tr>\n<tr><td>subscription</td><td>description</td></tr>\n<tr>\n<td  class=\"code\">forSelf:.</td>\n<td>render all the rows initially and after the Array node is set</td></tr>\n<tr>\n<td  class=\"code\">!afterCreate.1:.|*addRowView</td>\n<td>add a new row when an new item is added to the array</td>\n</tr>\n<tr>\n<td  class=\"code\">!afterUpdate.1:.|*updateRowView</td>\n<td>update the row when an item in the array is updated</td>\n</tr>\n<tr>\n<td  class=\"code\">!afterDel.1:.|*removeRowView</td>\n<td>remove the row when an item is remove from array</td>\n</tr>\n</table>",
        "signatures": []
    },
    {
        "name": "queryView",
        "namespace": "plugins",
        "shortDesc": "queryView",
        "longDesc": "<p>\nqueryView is a set of subscription group that allow you do simple query to an array model and display the query result in a list. Moreover, the result list will be updated when the underlining data is updated. However, the result list must be re-rendered completely but not partial rendered. The plugins also include a few subscription group that allow you do query such as sorting/reset sorting, filtering/reset filtering, paging/reset paging, and reset all query. All these are optional, you can pick whatever it is right for you.\n</p>\n\n<h3>Example</h3>\n<p>\nThe following is refactory of example in list view. The model is identical. And it just add additional mark-up to the view like the following.\n</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ehujax/6\">\n&lt;div data-sub=\"ns:demo\"&gt;\n   &lt;h3&gt;Query view&lt;/h3&gt;\n\n  &lt;div data-sub=\"ns:contacts;initQueryable:.\"&gt;\n    &lt;p&gt;search :\n      &lt;select data-sub=\"val:*query.filter.by\"&gt;\n        &lt;option&gt;All&lt;/option&gt;\n        &lt;option value=\"firstName\"&gt;First Name&lt;/option&gt;\n        &lt;option value=\"lastName\"&gt;Last Name&lt;/option&gt;\n      &lt;/select&gt;\n      &lt;select data-sub=\"val:*query.filter.ops\"&gt;\n        &lt;option&gt;contains&lt;/option&gt;\n        &lt;option value=\"equals\"&gt;equals&lt;/option&gt;\n      &lt;/select&gt;\n      &lt;input type=\"text\" data-sub=\"val:*query.filter.value|keyup\" /&gt;\n      &lt;input type=\"button\" value=\"Search\" data-sub=\"searchButton:.\" /&gt;\n      &lt;input value=\"Reset Search\" type=\"button\" data-sub=\"resetSearchButton:.\"\n      /&gt;\n    &lt;/p&gt;\n    &lt;table data-sub=\"showFound:.\"&gt;\n      &lt;tr&gt;\n        &lt;th data-sub=\"sortQueryButton:.|firstName\" title=\"sort by first name\"&gt;First Lame&lt;/th&gt;\n        &lt;th data-sub=\"sortQueryButton:.|lastName\" title=\"sort by last name\"&gt;Last Name&lt;/th&gt;\n        &lt;th&gt;\n          &lt;input value=\"reset sort\" type=\"button\" data-sub=\"resetSortButton:.\" /&gt;\n        &lt;/th&gt;\n      &lt;/tr&gt;\n      &lt;tbody data-sub=\"queryView:.|contact\"&gt;&lt;/tbody&gt;\n      &lt;tfoot data-sub=\"pager:.|pagerTemplate\"&gt;&lt;/tfoot&gt;\n    &lt;/table&gt;\n    &lt;p data-sub=\"hideFound:.\"&gt;No result found&lt;/p&gt;\n    &lt;p&gt;\n      &lt;input value=\"reset all\" type=\"button\" data-sub=\"resetQueryButton:.\" /&gt;\n    &lt;/p&gt;\n  &lt;/div&gt;\n&lt;/div&gt;\n</pre>\n\n",
        "signatures": []
    },
    {
        "name": "shadowEdit",
        "namespace": "plugins",
        "shortDesc": "shadowEdit",
        "longDesc": "<p>When we edit a document,  the editing does not immediately persisted until we save it. Under the ood,  we edit on a copy of the document, we have the option to save the change or we discard the change. \"shadowEdit\" plugins use same concept. The copy here is called shadow.  shadowEdit support both non-array object (including primitive type, such as string, boolean) and array.\n</p>\n",
        "signatures": []
    },
    {
        "name": "tabs",
        "namespace": "plugins",
        "shortDesc": "tabs",
        "longDesc": "<p>There are two kind of tabs, tab link, and tab view. Both of them have a selected class which is linked with a model node. If a model value is the same as as tab's tab id, the class will be applied to the tab, otherwise the class will be removed. A tab link is different from tab view in that, if a tab link is clicked, the model value will be changed to the tab id of the tab link. The tab id of tab view is saved in <code>data-tabView</code> attribute, the tab id of tab link is saved in <code>data-tabLink</code> attribute. Normally, the selected class can be used to control the visibility of a tab, but you can have other styling choice. The following shows how to show the tab with a selected class, and hide the tabs without the class.</p>\n\n<pre data-sub=\"prettyprint:_\">\ndiv[data-tabView] {\n  display: none;\n}\n\ndiv[data-tabView].selected {\n display: block;\n}\n</pre>\n\n<p>Tabs can be stand-alone or a children of a tab container. When they are stand-alone, each of them has their own subscriptions. When they are children of tab container, they don't have subscription at all, instead the tab container has, which is more memory efficient.  You can standalone tab and tab container at the same time, which give you lots styling flexibility. The following is an example.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n&lt;!--standalone tabs--&gt;\n&lt;li data-tabLink=\"news\" data-sub=\"tab:category\"&gt;News&lt;/li&gt;\n&lt;div data-tabView=\"news\" data-sub=\"tab:category\"&gt;contents&lt;/div&gt;\n\n&lt;!--tab container--&gt;\n&lt;ul data-sub=\"tabContainer:category\"&gt;\n  &lt;li data-tabLink=\"news\" &gt;News&lt;/li&gt;\n  &lt;div data-tabView=\"news\" &gt;contents&lt;/div&gt;\n&lt;/ul&gt;\n</pre>\n\n<p>The class applied to tab link and tab view is by default <code>selected</code>,  the attribute of tab view is by default <code>data-tabView</code> and the attribute of tab link is <code>data-tabLink</code> attribute, all this can be customized like following.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|\">\nhm.options.selectedClass = \"focus\";\nhm.options.tabViewAttr = \"tabView\";\nhm.options.tabLinkAttr = \"tabLink\";\n</pre>\n\n<h3>Example</h3>\n\n<p>The following example use both standalone tab and tab container at the same time, and they are associated with a model node \"category\" </p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/evedek/3\">\n&lt;div data-sub=\"ns:demo\"&gt;\n  &lt;div&gt;\n     &lt;h3&gt;stand-alone tab links and tab views (each of them has its own subscriptions)&lt;/h3&gt;\n    &lt;ul&gt;\n      &lt;li data-tabLink=\"news\" data-sub=\"tab:category\"&gt;News&lt;/li&gt;\n      &lt;li data-tabLink=\"opinion\" data-sub=\"tab:category\"&gt;Opinion&lt;/li&gt;\n      &lt;li data-tabLink=\"sports\" data-sub=\"tab:category\"&gt;Sports&lt;/li&gt;\n    &lt;/ul&gt;\n    &lt;div data-tabView=\"news\" data-sub=\"tab:category\"&gt;\n      &lt;p&gt;News News ....&lt;/p&gt;\n    &lt;/div&gt;\n    &lt;div data-tabView=\"opinion\" data-sub=\"tab:category\"&gt;\n      &lt;p&gt;Opinion Opinion ...&lt;/p&gt;\n    &lt;/div&gt;\n    &lt;div data-tabView=\"sports\" data-sub=\"tab:category\"&gt;\n      &lt;p&gt;Sports Sports Sports ...&lt;/p&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n\n  &lt;div&gt;\n     &lt;h3&gt;tab container for tab links and tab views (only contaner has subscriptions)&lt;/h3&gt;\n    &lt;div data-sub=\"tabContainer:category\"&gt;\n      &lt;ul&gt;\n        &lt;li data-tabLink=\"news\"&gt;News&lt;/li&gt;\n        &lt;li data-tabLink=\"opinion\"&gt;Opinion&lt;/li&gt;\n        &lt;li data-tabLink=\"sports\"&gt;Sports&lt;/li&gt;\n      &lt;/ul&gt;\n      &lt;div data-tabView=\"news\"&gt;\n        &lt;p&gt;News News ...&lt;/p&gt;\n      &lt;/div&gt;\n      &lt;div data-tabView=\"opinion\"&gt;\n        &lt;p&gt;Opinion Opinion ...&lt;/p&gt;\n      &lt;/div&gt;\n      &lt;div data-tabView=\"sports\"&gt;\n        &lt;p&gt;Sports Sports ..&lt;/p&gt;\n      &lt;/div&gt;\n    &lt;/div&gt;\n  &lt;/div&gt;\n&lt;/div&gt;\n</pre>\n\n<h3>nested tab containers</h3>\n\n<p>A tab container is good in that it uses just one subscription to manage all children tabs. However, if a tab container contains another container, clicking the tab link in the parent tab container will change the tabs in the children container as well, just like this <a href=\"http://jsbin.com/uqovut/2/edit\">example</a>.  To fix the problem,  we need to use groups apply to parent container and its child tab, so that the parent container will be touch the tabs in a child container, like the following example.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/asohay/1\">\n&lt;div data-sub=\"tabContainer:category|category\"&gt;\n  &lt;ul&gt;\n    &lt;li data-tabLink=\"news\" data-tabGroup=\"category\"&gt;News&lt;/li&gt;\n    &lt;li data-tabLink=\"opinion\" data-tabGroup=\"category\"&gt;Opinion&lt;/li&gt;\n    &lt;li data-tabLink=\"sports\" data-tabGroup=\"category\"&gt;Sports&lt;/li&gt;\n  &lt;/ul&gt;\n  &lt;div data-tabView=\"news\" data-tabGroup=\"category\"&gt;\n    &lt;p&gt;News News News&lt;/p&gt;\n  &lt;/div&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "usage",
        "namespace": "plugins.queryView",
        "shortDesc": "usage",
        "longDesc": "<p>\nTo use the queryView, the first step is to initialize the query feature like the following.\n</p>\n<pre data-sub=\"prettyprint:_\">\nhm( pathOfArray).initQueryable();\n</pre>\n\n<p>Internally it will create an query object  in the shadow node of the array, like the following. This object  interact with views to achieve the functions such as paging, sorting, filtering.\n</p>\n<pre data-sub=\"prettyprint:_\">\nhm(\"pathOfArray*\").extend({\npager: {\n enabled: false,\n index: 0, //nth page\n count: 1,\n size: 0\n},\n sort:  {\n  by: null, //currently we only support sort by one column sort\n  asc: null\n },\nfilter: {\n by: \"\",\n value: \"\",\n ops: \"\",\n enabled: false\n},\n//is query enabled\n enabled: function() {\n  return this.get( \"pager.enabled\" ) || this.get( \"sort.by\" ) || this.get( \"filter.enabled\" );\n}\n}); \n</pre>\n\n<p>\nThe following are a quick reference to the subscription group used in the samples. It shows the subscriptions include in each subscription group.\n</p>\n\n<table class=\"group\">\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">queryView:pathOfArray(e.g :items)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">forAll:*queryResult</td>\n\t\t<td>render all the rows in query result initially and after any change of the array which\n\t\t\tquery is against\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">sort:pathOfArray|propertyName (e.g sort:items|firstName)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$click:*query.sort.by|*hardCode</td>\n\t\t<td>change node at items*query.sort.by to the option value(firstName)</td>\n\t</tr>\n\n\t<tr>\n\t\t<td class=\"code\">$click:*query.sort.asc|*toggle</td>\n\t\t<td>flip the value of node at items*query.sort.asc</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$click:*refreshQuery</td>\n\t\t<td>trigger \"afterUpdate\" event to \"items*queryResult\" node</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">resetSortButton:pathOfArray(e.g resetSortButton:items)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$click:*resetSort</td>\n\t\t<td>call resetSort handler when view is click, which change the\n\t\t\t<code>sort.by</code>,\n\t\t\t<code>sort.asc</code>.\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">show:*query.sort.by</td>\n\t\t<td>show the view when it is <code>sort.by</code> has value</td>\n\t</tr>\n\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">searchButton:pathOfArray(e.g searchButton:items)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$click:*refreshQuery</td>\n\t\t<td>trigger <code>afterUpdate</code> events to items*queryResult when view is clicked.</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">enable:*query.filter.enabled</td>\n\t\t<td>enable the view when <code>filter.enabled</code> is true, otherwise disable</td>\n\t</tr>\n\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">resetSearchButton:pathOfArray(e.g resetSearchButton:items)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$click:*resetSearch</td>\n\t\t<td>invoke resetSearch handler when view is click, it will reset the\n\t\t\t<code>query.filter</code></td>\n\t</tr>\n\n\t<tr>\n\t\t<td class=\"code\">show:*query.filter.enabled</td>\n\t\t<td>enable the view when <code>filter.enabled</code> is true, otherwise disable</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">resetQueryButton:pathOfArray(e.g resetQueryButton:items)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$click:*resetQuery</td>\n\t\t<td>call resetQuery handler when view is click</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">show:*query.enabled</td>\n\t\t<td>show the view when <code>items*query.enabled</code> is true</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">searchBox:pathOfArray(e.g searchBox:items)</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">ns:*query.filter.value</td>\n\t\t<td>set the group ns to items*query.filter.value</td>\n\t</tr>\n\n\t<tr>\n\t\t<td class=\"code\">val:.|enter</td>\n\t\t<td>set the value of the textbox to the node when enter key is hit</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$esc:.|*null</td>\n\t\t<td>set null value to the node when esc key is hit</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">pager:pathOfArray|pagerTemplateId(e.g\n\t\t\tpager:items|pagerTemplateId)\n\t\t</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">forAll:*query.pager</td>\n\t\t<td>render the pager initially and re-render after any part of\n\t\t\t<code>items*query.pager</code> is changed.\n\t\t</td>\n\t</tr>\n\n\t<tr>\n\t\t<td class=\"code\">show:*hasQueryResult|_</td>\n\t\t<td>show the pager view when query result is not empty, otherwise hide it.</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">$paging:*paging</td>\n\t\t<td>when paging event triggered, call the handler at items*paging, which will change\n\t\t\t<code>*pager.index</code>, and trigger the <code>afterUpdate</code> event to\n\t\t\t<code>items*queryResult</code>.\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">preventDefault:_</td>\n\t\t<td>prevent the view's default behavior when view is clicked</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">setPageButton:pathOfArray</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">true:*query.pager.enabled;</td>\n\t\t<td>when view is clicked, set <code>items*query.pager.enabled</code> to true</td>\n\t</tr>\n\n\t<tr>\n\t\t<td class=\"code\">enable:*query.pager.size</td>\n\t\t<td>enable the view when <code>items*query.pager.size not zero</code></td>\n\t</tr>\n\n\t<tr>\n\t\t<td class=\"code\">$click*refreshQuery</td>\n\t\t<td>trigger <code>afterUpdate</code> to items*queryResult.</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">page:|pageIndex</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">dynamic group</td>\n\t\t<td>set the page index to to \"items*pager.index to the pageIndex when view\n\t\t\tis clicked. the pageIndex can be a number, or \"next\", \"previous\", \"first\", \"last\".\n\t\t</td>\n\t</tr>\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">showFound</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">show*hasQueryResult</td>\n\t\t<td>show view when query result has record, otherwise hide the view</td>\n\t</tr>\n\n\n\t<tr>\n\t\t<th colspan=\"2\" class=\"code\">hideFound</th>\n\t</tr>\n\t<tr>\n\t\t<td class=\"code\">show*hasQueryResult</td>\n\t\t<td>hide view when query result has record, otherwise show the view</td>\n\t</tr>\n\n</table>\n\n",
        "signatures": []
    },
    {
        "name": "for non-array",
        "namespace": "plugins.shadowEdit",
        "shortDesc": "for non-array",
        "longDesc": "<p>The shadow of non-array object will be dynamically created, when you want to shadow edit the object. The shadow object is like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm(\"objectPath*edit\", {\n  item: copyOfValue,\n  mode: function () {\n     //return \"read\" or \"update\"\n  }\n});\n</pre>\n\n<p>\nThe following example demo how to shadow edit an object.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/usomix/2\">\n\n\n&lt;div data-sub=\"ns:demo.contact\"&gt;\n  &lt;div data-sub=\"displayItemView:.|displayContact\"&gt;&lt;/div&gt;\n  &lt;div data-sub=\"editItemView:.|editContact\"&gt;&lt;/div&gt;\n&lt;/div&gt;\n&lt;script type=\"text/template\" id=\"editContact\"&gt;\n &lt;div data-sub=\"ns:*edit.item\"&gt;\n\t&lt;p&gt;\n\t\t&lt;input type=\"text\" class=\"firstName\" data-sub=\"val:firstName\"/&gt;\n\t&lt;/p&gt;\n   &lt;p&gt;\n\t &lt;input type=\"text\" class=\"lastName\" data-sub=\"val:lastName\"/&gt;\n\t&lt;/p&gt;\n\t&lt;p&gt;\n     &lt;input type=\"button\" value=\"Save\" data-sub=\"saveButton:.\"/&gt;\n\t  &lt;input type=\"button\" value=\"Cancel\" data-sub=\"cancelSaveButton:.\"/&gt;\n\t&lt;/p&gt;\n&lt;/div&gt;\n&lt;/script&gt;\n\n\n&lt;script type=\"jsrender\" id=\"displayContact\"&gt;\n  &lt;p&gt;first name: {{:firstName}}&lt;/p&gt;\n  &lt;p&gt;last name: {{:lastName}}&lt;/p&gt;\n   &lt;button data-sub=\"editObject:.\"&gt;edit&lt;/button&gt;\n&lt;/script&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n var model = hm(\"demo\", {\n    contact: { firstName: \"Jane\", lastName: \"Poe\"}\n  });\n</pre>\n\n<p>\nTo edit a primitive value such as string is similar, but just a bit simpler, since there is no need for a template like the followng.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/usomix/1\">\n&lt;div data-sub=\"ns:demo.name\"&gt;\n  &lt;span data-sub=\"hideOnEdit:.\" &gt;\n    &lt;span data-sub=\"text:.\"&gt;&lt;/span&gt;\n    &lt;button data-sub=\"editObject:.\"&gt;edit&lt;/button&gt;\n  &lt;/span&gt;\n  &lt;span data-sub=\"showOnEdit:.\" &gt;\n    &lt;input type=\"text\" data-sub=\"val:*edit.item\"&gt;\n    &lt;button data-sub=\"saveButton:.\"&gt;save&lt;/button&gt;\n    &lt;button data-sub=\"cancelSaveButton:.\"&gt;cancel&lt;/button&gt;\n  &lt;/span&gt;\n&lt;/div&gt;\n</pre>\n<pre data-sub=\"prettyprint:_\">\nvar model = hm(\"demo\", {\n    name: \"John\"\n  });\n</pre>\n\n<p>\nThe edit a label like above use lots of mark-up, we can write a simple subscription group to simplified this like the following:</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ijelon/3\">\n\n\n&lt;span data-sub=\"editable:name\"&gt;&lt;/span&gt; \n</pre>\n\n<p>The \"editable\" subscription group is defined as follow</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.groups.editable2 = function( elem, path, group, options ) {\n  setTimeout( function() {\n\n    var attribute = \"ns:/\" + path + \"*edit.item;\" +\n                    \"showOnEdit:&lt;;\" +\n                    \"val:.|enter;\" +\n                    \"$enter:.|*saveShadowItem;\" +\n                    \"$esc:.|*resetShadowItem;\" +\n                    \"focus:&lt;*edit.mode|update\";\n\n    $( '&lt;input type=\"text\" data-sub=\"' + attribute + '\" /&gt;' )\n      .insertAfter( elem ).parseSub();\n\n  }, 10 );\n\n};\n\nhm.groups.editable = \"hideOnEdit:.;\" +\n                     \"text:.;\" +\n                     \"$dblclick:.|*editShadowItem;\" +\n                     \"editable2:.\";\n</pre>",
        "signatures": []
    },
    {
        "name": "for array",
        "namespace": "plugins.shadowEdit",
        "shortDesc": "for array",
        "longDesc": "<p>shadowEdit for array model is a little different from shadow edit for object and primitive types. You can not edit an array literally, instead you create, update, and remove an array item.  Array model is normally displayed by list view or query view.  ShadowEdit support both widget.  To shadow edit an array, we need to do some initialization like the following.</p>\n\n<pre data-sub=\"prettyprint:_\">\nitemsNode.initShadowEdit();\n//or\nitemsNode.initQueryable();\nitemsNode.cd(\"*queryResult\").initShadowEdit();\n</pre>\n\n<p>\nUnder the hood, it create a edit object in the shadow node like the following\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|\">\nhm(\"items*edit\", {\n  item: null,\n  index: -1,\n  mode: function () {\n     //return \"read\" or \"update\" or \"new\"\n  },\n itemTemplate: object\n});\n//or\nhm(\"items*queryResult*edit\", {\n  item: null,\n  index: -1,\n  mode: function () {\n     //return \"read\" or \"update\" or \"new\"\n  },\n itemTemplate: object\n});\n</pre>\n\n<h3>Example</h3>\n<p> In the following example,  inside the list view and query view, each row has an edit button and delete button. There is an add button. When update button or new button is clicked, and a edit view is displayed and the list view or query view is hidden.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ocabor/4\">\n&lt;div data-sub=\"ns:demo.contacts\"&gt;\n  &lt;div&gt;\n    \t&lt;h3&gt;list view&lt;/h3&gt;\n\n    &lt;table data-sub=\"hideOnEdit:.\"&gt;\n      &lt;thead&gt;\n        &lt;tr&gt;\n          &lt;td colspan=\"3\"&gt;\n            &lt;input type=\"button\" value=\"New Contact\" data-sub=\"newItem:.\" /&gt;\n          &lt;/td&gt;\n        &lt;/tr&gt;\n        &lt;tr&gt;\n          &lt;th&gt;First Name&lt;/th&gt;\n          &lt;th&gt;Last Name&lt;/th&gt;\n          &lt;th&gt;action&lt;/th&gt;\n        &lt;/tr&gt;\n      &lt;/thead&gt;\n      &lt;tbody data-sub=\"listView:.|contactRow;shadowEdit:.;movableRow:.\"&gt;&lt;/tbody&gt;\n    &lt;/table&gt;\n    &lt;div data-sub=\"editItemView:.|contactInEditMode;\"&gt;&lt;/div&gt;\n  &lt;/div&gt;\n  &lt;hr&gt;\n  &lt;div&gt;\n     &lt;h3&gt;query view&lt;/h3&gt;\n\n    &lt;div data-sub=\"hideOnEdit:*queryResult\"&gt;\n      &lt;input type=\"button\" value=\"New Contact\" data-sub=\"newItem:*queryResult\"\n      /&gt;\n      &lt;div&gt;search\n        &lt;select data-sub=\"val:*query.filter.by\"&gt;\n          &lt;option value=\"\"&gt;All&lt;/option&gt;\n          &lt;option value=\"firstName\"&gt;First Name&lt;/option&gt;\n          &lt;option value=\"lastName\"&gt;Last Name&lt;/option&gt;\n        &lt;/select&gt;\n        &lt;select data-sub=\"val:*query.filter.ops\"&gt;\n          &lt;option value=\"\"&gt;contains&lt;/option&gt;\n          &lt;option value=\"equals\"&gt;equals&lt;/option&gt;\n        &lt;/select&gt;\n        &lt;input type=\"text\" data-sub=\"searchBox:.\" /&gt;\n        &lt;input value=\"Reset Search\" type=\"button\" data-sub=\"resetSearchButton:.\"\n        /&gt;\n      &lt;/div&gt;\n      &lt;table data-sub=\"showFound:.\"&gt;\n        &lt;thead&gt;\n          &lt;tr&gt;\n            &lt;th style=\"cursor: pointer\" data-sub=\"sortQueryButton:.|firstName\"&gt;First Name&lt;/th&gt;\n            &lt;th style=\"cursor: pointer\" data-sub=\"sortQueryButton:.|lastName\"&gt;Last Name&lt;/th&gt;\n            &lt;th&gt;\n              &lt;input value=\"reset sort\" type=\"button\" data-sub=\"resetSortButton:.\" /&gt;\n            &lt;/th&gt;\n          &lt;/tr&gt;\n        &lt;/thead&gt;\n        &lt;tbody data-sub=\"queryView:.|contactRow;shadowEdit:*queryResult\"&gt;&lt;/tbody&gt;\n        &lt;tfoot data-sub=\"pager:.|pagerTemplate\"&gt;&lt;/tfoot&gt;\n      &lt;/table&gt;\n      &lt;p data-sub=\"hideFound:.\"&gt;No result found&lt;/p&gt;\n      &lt;p&gt;\n        &lt;input value=\"reset query\" type=\"button\" data-sub=\"resetQueryButton:.\"\n        /&gt;\n      &lt;/p&gt;\n    &lt;/div&gt;\n    &lt;div data-sub=\"ns:*queryResult;editItemView:.|contactInEditMode\"&gt;&lt;/div&gt;\n  &lt;/div&gt;\n&lt;/div&gt;\n</pre>\n\n<p>In the following example,  you can edit the existing rows inside the list view or query view,  this is implemented by shadowEditInRow group. The tricky part of it is that, the new item view will be rendered when shadow is new mode, but not in edit mode. When it is in edit mode, it the in-row-edit view will be rendered. Also we need fix the shadow object path in the in-row-edit view like the following template, the key is to use <code>/</code> in <code>ns:/{{:~modelPath}}*edit.item</code>.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/etacob/4\">\n\n\n&lt;script type=\"text/template\" id=\"contactRowInEditMode\"&gt;\n&lt;tr data-sub=\"ns:/{{:~modelPath}}*edit.item\"&gt;\n &lt;td&gt;\n  &lt;input type=\"text\" class=\"firstName\" data-sub=\"val:firstName\"/&gt;\n &lt;/td&gt;\n &lt;td&gt;\n  &lt;input type=\"text\" class=\"lastName\" data-sub=\"val:lastName\"/&gt;\n &lt;/td&gt;\n &lt;td&gt;\n  &lt;input type=\"button\" value=\"Update\" data-sub=\"saveButton:.\"/&gt;\n  &lt;input type=\"button\" value=\"Cancel\" data-sub=\"cancelSaveButton:.\"/&gt;\n &lt;/td&gt;\n&lt;/tr&gt;\n&lt;/script&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "Under the hood",
        "namespace": "plugins.shadowEdit",
        "shortDesc": "Under the hood",
        "longDesc": "<p>The shadowEdit depends on an shadow EditObject, which is under the shadow object. However, we don't really need a shadowEdit plugins to do shadow edit. The following shows how to implement shadow edit without the plugins, and the shows how use shadowEdit plugin to remove this boilerplate.\n</p>\n\n<h3>Ad-hoc implementation of shadow edit.</h3>\n<p>The following is the model of the scenario. It shadow an shadow objects, and several handler that handler to modified the model. The example is bit long, the view is omitted here.  please click on jsbin link to read it.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/itiwun/2\">\n  var contacts = hm(\"demo.contacts\"),\n      edit = hm(\"demo.edit\");\n  \n  hm(\"demo\", {\n    contacts: [\n      { firstName: \"Jane\", lastName: \"Poe\" }, \n      { firstName: \"Robert\",lastName: \"Roe\"}, \n      { firstName: \"Brett\", lastName: \"Boe\"}, \n      { firstName: \"Carla\", lastName: \"Coe\"}, \n      { firstName: \"Donna\", lastName: \"Doe\"}, \n      { firstName: \"Juan\", lastName: \"Doe\" }\n    ],\n    \n    //the following logics impelements the \n    //shadow edit in a adhoc process\n    //\n    //shadow object and other state\n    edit: {\n      mode:\"read\",\n      item: null,\n      selectedIndex: -1,\n      itemTemplate: {\n        firstName: null,\n        lastName: null\n      }\n    },\n    //delete\n    removeConact: function (e) {\n      var index = e.selectedRowIndex();\n      contacts.removeAt(index);\n    },\n    //create\n    addNewContact: function (e) {\n      edit.set(\"item\", hm.util.clone(edit.get(\"itemTemplate\")));\n      edit.set(\"mode\", \"edit\");\n    },\n    //edit\n    editContact: function (e) {\n      var index = e.selectedRowIndex(),\n          item = contacts.get(index);\n      edit.set(\"selectedIndex\", index);\n      edit.set(\"item\", hm.util.clone(item, true));\n      edit.set(\"mode\", \"edit\");\n     },\n    //save\n    saveEdit: function (e) {\n      var index = edit.get(\"selectedIndex\"),\n          editingContact = edit.get(\"item\");\n      \n      if (index != -1) {\n        //update\n        contacts.updateAt(index, editingContact);\n        edit.set(\"selectedIndex\", -1);\n      } else {\n        //add\n        contacts.push(editingContact);\n      }\n      edit.set(\"mode\", \"read\");\n      edit.set(\"item\", null);\n    },\n    //cancel\n    cancelEdit: function (e) {\n      edit.set(\"mode\", \"read\");\n      edit.set(\"item\", null);\n      edit.set(\"selectedIndex\", -1);\n    }\n  });\n</pre>\n\n<h3>Implementation using shadowEdit plugin</h3>\n<p>The model using here is only the pure data, it will not be show here. All those ad-hoc handler and shadow object are removed, because the \"shadowEdit\" already implement them. Got to jsbin, to compare them side by side. \"shadowEdit\" do the same thing as the adh-hoc implementation, but it is reusable for other similar case. The following only shows the view\n</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uceces/11\">\n&lt;div data-sub=\"ns:demo.contacts\"&gt;\n   &lt;h3&gt;list view&lt;/h3&gt;\n\n  &lt;table data-sub=\"hideOnEdit:.\"&gt;\n    &lt;tr&gt;\n      &lt;td colspan=\"2\"&gt;\n        &lt;button data-sub=\"newItem:.\"&gt;Add new contact&lt;/button&gt;\n      &lt;/td&gt;\n    &lt;/tr&gt;\n    &lt;tr&gt;\n      &lt;th&gt;First Name&lt;/th&gt;\n      &lt;th&gt;Last Name&lt;/th&gt;\n      &lt;th&gt;action&lt;/th&gt;\n      &lt;th&gt;&lt;/th&gt;\n    &lt;/tr&gt;\n    &lt;tbody data-sub=\"listView:.|contact;shadowEdit:.\"&gt;&lt;/tbody&gt;\n  &lt;/table&gt;\n  &lt;div data-sub=\"editItemView:.|editingCotnact\"&gt;&lt;/div&gt;\n&lt;/div&gt;\n    \n&lt;script type=\"jsrender\" id=\"contact\"&gt;\n   &lt;tr&gt;\n      &lt;td&gt;{{:firstName}}&lt;/td&gt;\n      &lt;td&gt;{{:lastName}}&lt;/td&gt;\n        &lt;td&gt;\n          &lt;button data-sub=\"editRow:_\"&gt;edit&lt;/button&gt;\n            &lt;button data-sub=\"deleteRow:_;\"&gt;delete&lt;/button&gt;  \n            \n        &lt;/td&gt;\n        &lt;td&gt;{{ts /}}&lt;/td&gt;\n    &lt;/tr&gt;\n  &lt;/script&gt;\n &lt;script type=\"jsrender\" id=\"editingCotnact\"&gt;\n   &lt;div data-sub=\"ns:*edit.item\"&gt;\n     &lt;p&gt;\n\tFirst Name: &lt;input type=\"text\" data-sub=\"val:firstName\"&gt;\n   &lt;/p&gt;\n   &lt;p&gt;\n  Last Name: &lt;input type=\"text\" data-sub=\"val:lastName\"&gt;\n &lt;/p&gt;\n  &lt;p&gt;\n     &lt;button data-sub=\"saveButton:.\"&gt;Ok&lt;/button&gt;\n      &lt;button data-sub=\"cancelSaveButton:.\"&gt;Cancel&lt;/button&gt;\n    &lt;/p&gt;\n\t&lt;/div&gt;\n&lt;/script&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "itemTemplate",
        "namespace": "plugins.shadowEdit",
        "shortDesc": "itemTemplate",
        "longDesc": "<p>To shadow edit an array node, one of the tasks is to create new item. The new item is based on a itemTemplate. By default, when initiating shadowEdit for array or array query, the template schema is inferred from the schema of the first item in array or array query. However, the item template can be explicitly set, it either an object or it is function to create a new item.  There are two way to set the item template.\n</p>\n\n<h3>Programatically set item template</h3>\n\n<p>We can set it from initShadowEdit() like the following.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/inaqiz/1\">\nitemsNode.initShadowEdit(object);\nitemsNode.cd(\"*queryResult\").initShadowEdit(object);\n//or\nitemsNode.initShadowEdit(objectBuilder);\nitemsNode.cd(\"*queryResult\").initShadowEdit(objectBuilder);\n</pre>\n\n<h3>Set item template by convention</h3>\n<p>If the array path is \"items\", the initShadowEdit expect \"items_itemTemplate\" is the item template.</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ipusay/1\">\nvar model = hm(\"demo\", {\n    contacts: [\n      { firstName: \"Jane\", lastName: \"Poe\"},\n      { firstName: \"Robert\", lastName: \"Roe\"},\n      { firstName: \"Brett\", lastName: \"Boe\"},\n      { firstName: \"Carla\", lastName: \"Coe\"},\n      { firstName: \"Donna\", lastName: \"Doe\"},\n      { firstName: \"Juan\", lastName: \"Doe\"}\n      ],\n    contacts_itemTemplate: function () {\n      return {\n        firstName: \"firstName\",\n        lastName: \"lastName\"\n      };\n    }\n  });\n</pre>",
        "signatures": []
    },
    {
        "name": "table",
        "namespace": "plugins",
        "shortDesc": "table",
        "longDesc": "<p>\nIn harmony, the concept of table is not about view. It is a data structure. It is special array, each item of which, is associated with a guid or key, which never changed.\n</p>\n<p>The subscription in Harmony depends model path. When one array item is removed, the index of other item will shift,  because array index is part of the path, their path will change as well, so their original subscriptions in will break down. </p>\n\n<h3>example 1</h3>\n<p>In the following example, it shows the problems. Before you delete row, or move a row. All the subscriptions works fine. However, if you delete first row, all the subscriptions of the following rows will working wrongly, for example editing the on the first roll actually change data of the second item in the array. The problem is that indexToNs tag generate ns:/demo.grid.0. That \"0\" is the index of the item in array. When item added or removed, the original subscription will break.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/agufet/3\">\n\n\n&lt;tbody data-sub=\"ns:grid;listView:.|row;movableRow:.;shadowEdit:.\"&gt;&lt;/tbody&gt;\n\n&lt;script type=\"jsrender\" id=\"row\"&gt;\n  &lt;tr data-sub=\"{{indexToNs /}}\"&gt;\n    &lt;td&gt;\n      &lt;input type=\"text\" data-sub=\"val:c0|keyup\"&gt;\n    &lt;/td&gt;\n    &lt;td&gt;\n      &lt;input type=\"text\" data-sub=\"val:c1|keyup\"&gt;\n    &lt;/td&gt;\n    &lt;td&gt;\n      &lt;input type=\"text\" data-sub=\"val:c2|keyup\"&gt;\n    &lt;/td&gt;\n    &lt;td&gt;\n      &lt;input type=\"button\" value=\"delete\" data-sub=\"deleteRow:.\"&gt;\n      &lt;input type=\"button\" value=\"move up\" data-sub=\"moveUpButton:.\"&gt;\n      &lt;input type=\"button\" value=\"move down\" data-sub=\"moveDownButton:.\"&gt;\n      {{ts /}}\n    &lt;/td&gt;\n  &lt;/tr&gt;\n&lt;/script&gt;\n</pre>\n\n<h3>Example</h3>\n<p>\nThis problem can be worked around by re-render the hold grid when a array item updated (not when a property of an item is updated) by replacing subscription group <code>listView</code> with <code>forChildren</code>, like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ivadup/1\">\n\n&lt;tbody data-sub=\"forChildren:.|row;movableRow:.;shadowEdit:.\"&gt;&lt;/tbody&gt;\n</pre>\n\n<p>The full re-rendering might be \"ok\" for a couple of rows, but it might be a problem for rare case such as large grid with 1000 rows. The problem is that we don't have fixed subscription path. The table plugins is to solve this problem.  A table has primary key, each row has unique key, even some rows in the table deleted, we can always use the same key to located the item.\n</p>\n\n<h3>Example 3</h3>\n<p>\nIn the following example, we can use two changes the example 1. The first is to convert the array into table using hm.table, secondly it is to replace indexToNs to keyToNs.\n</p>\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/okokab/1\">\nhm(\"demo\", {\n    grid: hm.table( [\n      {c0: \"00\", c1: \"01\", c2: \"02\" },\n      {c0: \"10\", c1: \"11\", c2: \"12\"},\n      {c0: \"20\", c1: \"21\", c2: \"22\"},\n      {c0: \"30\", c1: \"31\", c2: \"32\"},\n      {c0: \"40\", c1: \"41\", c2: \"42\"}\n    ]),\n    addRow: function( e ) {\n      grid.push( {c0: \"\", c1: \"\", c2: \"\"} );\n    }\n  });\n</pre>\n<pre data-sub=\"prettyprint:_;preview:_|\">\n&lt;tr data-sub=\"{{keyToNs /}}\"&gt;\n</pre>\n\n<p>\nWhat the hm.table does, is to adding an extra table property to the array, and harmony will synchronize the array items with the items in that table object. The key of table object is an guid, and the value is an item in the array. So even the items are added or remove, their counter-part in the table always has same key. The keyToNs tag is to generate the namespace with the key, such as ns:/demo.grid.table.c2. The \"c2\" is the primary key which will never change.\n</p>",
        "signatures": []
    },
    {
        "name": "validation",
        "namespace": "plugins",
        "shortDesc": "validation",
        "longDesc": "\n<p>There are 4 steps in using the validation in Harmony</p>\n\n<ol>\n<li>create validator</li>\n<li>apply validator</li>\n<li>invoke validator</li>\n<li>act on validity</li>\n</ol>\n\n<h3>Under the hood</h3>\n\n<p>Let's say, we attach a validator to  model <code>hm(\"foo\")</code>,  behind the scene, an handler is attached to the <code>afterUpdate</code> handler. The first time it changes, validator is called. If model is valid, nothing is changed, if the model value is invalid, handler will generate an error message in <code>hm(\"foo*errors\")</code> and add the path <code>foo</code> to the <code>hm(\"*invalidPaths\")</code>. If value changed again, and value is valid, the error generated previous will be removed from <code>hm(\"foo*errors\")</code>, and the path <code>foo</code> will be remove from <code>hm(\"*invalidPaths\")</code>.</p>\n\n<h3>Example</h3>\n<p>The following example uses <code>hm(\"foo\").validator()</code> to add 3 validators to the model, <code>required</code>, <code>number</code> and a custom handler.  Observe how the debug data dump changes when you key in a value.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ocofat/2\">\n  hm(\"demo\", {\n    number: null\n  });\n  \n  hm(\"demo.number\").validator([\n    \"required\",\n    \"number\",\n    function (value) {\n      if (value &lt; 100) {\n         return \"you must enter not less than 100\"; \n      }\n    }\n  ]);\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n &lt;div data-sub=\"ns:demo\"&gt;\n    &lt;label&gt;\n    Ener a number over 100: \n    \n    &lt;input type=\"text\" data-sub=\"val:number|keyup\" /&gt;\n    &lt;/label&gt;\n\n  &lt;/div&gt;\n  &lt;div data-sub=\"dump:demo.number\"&gt;&lt;/div&gt;\n  &lt;div data-sub=\"dump:demo.number*errors\"&gt;&lt;/div&gt;\n  &lt;div data-sub=\"dump:*invalidPaths\"&gt;&lt;/div&gt;\n</pre>\n\n<p>\nThe data in node <code>path*errors</code> and <code>*invalidPaths</code> can be used to rendering warning to user. Harmony comes with a simple \"warning\" subscription group, which shows error beside the input widget, and \"checkValidity\" subscription group, which check whether the descendants of a node and the node itself have any error. But it is possible that you use customize the warning processing because data and events are there. The following example make a small change on previous example.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ogulis/3\">\n  &lt;div data-sub=\"ns:demo\"&gt;\n    &lt;div&gt;\n    &lt;label&gt;\n    Ener a number over 100: \n    \n      &lt;input type=\"text\" data-sub=\"val:number|keyup;warn:number\" /&gt;\n    &lt;/label&gt;\n    &lt;/div&gt;\n    \n    &lt;div&gt;\n      &lt;button data-sub=\"\n        checkValidity:.;\n        alert:.|You data is submitted;\"&gt;Submit&lt;/button&gt;      \n    &lt;/div&gt;\n  &lt;/div&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "programmatically",
        "namespace": "plugins.validation.apply validator",
        "shortDesc": "apply validator programmatically",
        "longDesc": "<p>We can use node.validator() to apply validator to model</p>",
        "signatures": [
            {
                "name": "node.validator(validator[, options])",
                "returns": "Node",
                "shortDesc": "apply a validator a model node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.validator(commonValidator[, options])",
                        "parameters": [
                            {
                                "name": "commonValidator",
                                "type": "string",
                                "desc": "the name of common validator, such as \"required\", \"number\" etc."
                            },
                            {
                                "name": "options",
                                "type": "object",
                                "desc": "optional, the options to customize common validator. Different common validator might have different options."
                            }
                        ]
                    },
                    {
                        "versionAdded": "0.1",
                        "name": "node.validator(adHocValidator)",
                        "parameters": [
                            {
                                "name": "adHocValidator",
                                "type": "function",
                                "desc": "a function to check whether a value is valid or not, if it is invalid, return an error message or return false to use the default error message.\n<pre data-sub=\"prettyprint:_;preview:_|\">\nfunction (value) {\n  //check value\n //return error message or return false or return undefined\n}\n</pre>"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "<p>The following use check to apply <code>required</code> validator to two nodes. One has an options, which is the error message. One does not have an option, which use default error message of the validator.</p>",
                        "code": "  hm(\"demo\", {\n    name: null,\n    phone: null\n  });\n  \n  \n  hm(\"demo.name\").validator(\"required\");\n  hm(\"demo.phone\").validator(\"required\", \"Please enter a phone number\");",
                        "url": "http://jsbin.com/itunol/3"
                    },
                    {
                        "desc": "<p>This example use a ad-hoc function to return different error message based on the input value</p>",
                        "code": "hm(\"demo\", {\n  number: null\n });\n  \nhm(\"demo.number\").validator(\"required\");\nhm(\"demo.number\").validator(function( value ) {\n if (!$.isNumeric( value )) {\n   return \"Please enter a number between 1 and 100, e.g 50\";\n  } else if (value > 50) {\n   return \"Please enter a smaller number\";\n } else if (value < 50) {\n  return \"Please enter a larger value\";\n }\n});\n  ",
                        "url": "http://jsbin.com/urecov/2"
                    }
                ]
            },
            {
                "name": "node.validator(validators)",
                "returns": "Node",
                "shortDesc": "apply multiple validators to a node",
                "desc": "",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.validator(validators)",
                        "parameters": [
                            {
                                "name": "validators",
                                "type": "array",
                                "desc": "an array of validators, the item of which can be a commonValidator, or [commonValidator, options], or ad-hoc functions."
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "<p>This example add multiple validator in a single call.\n</p>",
                        "code": "  hm(\"demo\", {\n    number: null\n  });\n  \n  hm(\"demo.number\").validator(\n    [\n      //validator 1, common validator with options\n      [\"required\", \"Number field is required\"],\n      //validator 2, common validator with no options\n      \"number\",\n      //validator 2, ad-hoc validator\n      function (value) {\n        if (value > 50) {\n\t\t\treturn \"Please enter a smaller number\";\n\t\t} else if (value < 50) {\n\t\t\treturn \"Please enter a larger value\";\n\t\t}\n      }\n    ]);",
                        "url": "http://jsbin.com/ofisal/2"
                    }
                ]
            },
            {
                "name": "node.validator(validatorGroup)",
                "returns": "node",
                "shortDesc": "apply a group of validators the children of the node.",
                "desc": "If a node has multiple children, this method can apply validators to children in one single call.",
                "overloads": [
                    {
                        "versionAdded": "0.1",
                        "name": "node.validator(validatorGroup)",
                        "parameters": [
                            {
                                "name": "validatorGroup",
                                "type": "object",
                                "desc": "validator group is like \n<pre data-sub=\"prettyprint:_\">\n{\n   subProperty1: validatorOrValidators1,\n   subProperty2: validatorOrValidators2\n}\n//validatorOrValidators can be a validator, or\n// [validator, options], \n//or [ validator1, [validator2, options2], validator3]\n</pre>"
                            }
                        ]
                    }
                ],
                "examples": [
                    {
                        "desc": "<p>The following example use validationGroup to register all the validations to the property of registration node.</p> \n\n</p>",
                        "code": " hm( \"demo\", {\n      registration: {\n        email: \"\",\n        url: \"\",\n        name: \"\",\n        age: \"\",\n        password: \"\",\n        repeat_password: \"\",\n        accepted: false\n      },\n      message: \"You request has been submitted\"\n    }\n  );\n\n  hm( \"demo.registration\" ).validator( {\n    email: [\"email\", \"required\"],\n    url: \"url\",\n    name: [\n      [\"regex\", \"/[a-zA-Z ]{5,}/,You must specify a valid name with at least 5 characters.\"],\n      \"required\"\n    ],\n    age: [\n      [\"number\", \"age must be a number\"]\n    ],\n    password: \"required\",\n    repeat_password: [\"required\", [\"equal\", \"..password,The passwords are not the same.\"]],\n    accepted: [\n      [\"required\", \"You must agree the terms\"],\n      [\"fixedValue\", \"true\" ]\n    ]\n  } );",
                        "url": "http://jsbin.com/itafag/3"
                    }
                ]
            }
        ]
    },
    {
        "name": "default error",
        "namespace": "plugins.validation.apply validator.bundled validator",
        "shortDesc": "default error",
        "longDesc": "<p>\nWhen you add common validator, its default message is saved at <code>hm.options.errors</code>. So the following allow you change the default error message of <code>required</code> validator to Chinese.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|\">\nhm.options.errors.required = \"这一栏是必须的\";\n</pre>\n\n",
        "signatures": []
    },
    {
        "name": "create validator",
        "namespace": "plugins.validation",
        "shortDesc": "create validator",
        "longDesc": "<p>\nThere are two kinds of validator in Harmony, ad-hoc validator and common validator\n</p>\n<h3>ad-hoc validator</h3>\n<p>\nAd-hoc validator is just a function, whether check a value is valid. If it is valid, do nothing. If it is invalid, return an error message, or return false if you want to use the error message in defined in <code>hm.options.errors.defaultError</code>. The following is simple example.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nfunction( value ) {\n if (value > 50) {\n   return \"Please enter a smaller number\";\n } else if (value < 50) {\n  return \"Please enter a larger value\";\n }\n}\n</pre>\n\n<h3>common validator</h3>\n\n<p>Common validator are reusable, they can be referenced by name. Harmony comes with 17 common validators. Most of these validators are very simple. The following shows the implementation of <code>minlength</code> validator. This validator has all the members of validator. But in only \"name\", and \"isValid\" are required members. \n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.validator( {\n  //required\n  name: \"minlength\",\n\n  //required\n  //the options parameter is optional, it is created by \n  //the initialize function as below\n  isValid: function( value, options ) {\n    return value.length &gt;= options.minlength;\n  },\n\n  //optional, required only if your validator \n  //has parameters, like the one \"minlength\" here\n  //options is the string or object passed in when \n   //the validator is applied.\n  initialize: function( publisher, subscriber, handler, options ) {\n    var match;\n    if (options &amp;&amp; (match = rFirstToken.exec( options ))) {\n      handler.options = {\n        minlength: +match[1],\n        error: match[3]\n      };\n    } else {\n      throw \"invalid options for minlength validator\";\n    }\n  },\n\n  //optional, default value is hm.options.errors.defaultError \n  //it is the error message when the model is invalid, or\n  //it is the error template which will be passed into \n   //buildError if it is available.\n  error: \"Please enter at least {minlength} characters.\",\n \n  //optional, required only if you build a error based \n  //on options created in initialize function\n  // it is a function like function ( errorTemplate, options ) { }\n  buildError: hm.validator.defaultErrorBuilder\n} );\n</pre>\n\n<p>\n<code>hm.validator.defaultErrorBuilder</code> is helper function, the following shows what it does.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/iyayed/2\">\n\n\nvar error = hm.validator.defaultErrorBuilder(\"hell, {name}\", {name: \"john\"});\nhm.log(error);\n</pre>\n\n<h3>Example</h3>\n<p>You can create your own common validator if you have one is which can be reused in your development. Let's create a zip code validator which is not included in Harmony. It also used a helper function <code>hm.validator.buildRegexFn</code> which can build regular expression checker.\n\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ogulis/4\">\n\nhm.validator({\n  name: \"zipCode\",\n  error: \"Please enter a valid zip code\",\n  isValid: hm.validator.buildRegexFn(/^\\d{5}(-\\d{4})?$/)\n});\n</pre>",
        "signatures": []
    },
    {
        "name": "apply validator",
        "namespace": "plugins.validation",
        "shortDesc": "apply validator",
        "longDesc": "<p>The validation plugin in Harmony is a bit different from other validation library. Here the target of validation is not the value a input widget holds, instead it is the value of model.</p>\n\n<p>There are two ways to apply validator to model nodes, programatically or declaratively. Normally, programmatic method is the preferred way, because does not clutter the UI code, and because the the validation apply to model not view. But sometime it is convenient to use declarative way, because the model is created dynamically such as the shadow edit module. It is hard to do that programatically .\n</a>\n",
        "signatures": []
    },
    {
        "name": "declaratively",
        "namespace": "plugins.validation.apply validator",
        "shortDesc": "apply validator declaratively",
        "longDesc": "<h3>applying common validator to declaratively</h3>\n\n<p>\nWhen common validator is created, a subscription group is also automatically created. So we can use <code>validatorName:path|options</code>,to apply common validator declaratively. The following apply <code>required</code>, <code>regex</code> to a model \"name\". Please note this subscription group has nothing to do with the view, the textbox, you can attach these subscription group to other elements, it still works.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|\">\n&lt;input type=\"text\" data-sub=\"\n    ns:name;\n    val:.;\n    required:.;\n    regex:.|/[a-zA-Z ]{5,}/,You must specify a valid name.;\n    warn:.\"/&gt;\n</pre>\n\n<p>\nGenerally, you apply validator programmatically, because its easy to maintain. But sometime is much easier that declaratively. Because the model is dynamically created. In the following example,  the shadow edit item is constantly created and deleted, we want to apply <code>required</code> validator to the shadow edit object's first name, and last name,  it is hard to do that programmatically. And we have to do that using markup.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/eduqew/1\">\n\n&lt;script type=\"text/template\" id=\"contactInEditMode\"&gt;\n &lt;div data-sub=\"ns:*edit.item\"&gt;\n\t&lt;p&gt;\n\t\t&lt;input type=\"text\" class=\"firstName\" \n          data-sub=\"ns:firstName;val:.;required:.;warn:.\"/&gt;\n\t&lt;/p&gt;\n   &lt;p&gt;\n\t &lt;input type=\"text\" class=\"lastName\" \n       data-sub=\"ns:lastName;val:.;required:.;warn:.\"/&gt;\n\t&lt;/p&gt;\n         \n\t&lt;p&gt;\n     &lt;input type=\"button\" value=\"Save\" \n       data-sub=\"saveButton:.;checkValidity:.\"/&gt;\n\t  &lt;input type=\"button\" value=\"Cancel\" data-sub=\"cancelSaveButton:.\"/&gt;\n        {{ts /}}\n\t&lt;/p&gt;\n&lt;/div&gt;\n&lt;/script&gt;\n</pre>\n\n<h3>applying ad-hoc validator to declaratively</h3>\n\n<p>\nFirst the ad-hoc validator must be put in repository. Then we can reference it from view.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/aceqog/1\">\n\n&lt;input type=\"text\" data-sub=\"ns:name;val:.|keyup;required:.;validator:.|..checkName;warn:.\"&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n hm(\"demo\", {\n    name: \"\",\n    checkName: function (value) {\n      if (value.length &lt; 5) {\n        return \"name must have at least 5 chracters\"; \n        \n      }\n    }\n  });\n</pre>\n",
        "signatures": []
    },
    {
        "name": "bundled validator",
        "namespace": "plugins.validation.apply validator",
        "shortDesc": "bundled validator",
        "longDesc": "<p>Harmony bundles a 17 frequently used common validator which can be referenced by name like the following\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|\">\nnode.validator(commonValidatorName, options);\n</pre>\n\n<p>The options is usually used to override the default error message of the validator. But some of them also use it to provide the mandatory value of the parameters the validator depends on, these validators include <code>equal</code>, <code>fixedValue</code>, <code>regex</code> and so on. If a common validator does not have parameters, then the options is custom error message, if it has parameter, then the options following the pattern.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\np1,p2,...,error message\n</pre>\n<p>The following is example of adding your own custom error message\"</p>\n\n<pre data-sub=\"prettyprint:_\">\nnameNode.validator(\"required\", \"The name is required!\");\nvalumeNode.validator(\"range\", \"1000,2000,The volume must be between 1000 to 2000\");\n</pre>\n\n\n<p>A model node can have multiple validators applied at same time. One special validator is <code>required</code>. If the model value is missing, or an empty string, or a string with just empty characters such as tab, space, but the model is not required, other validators are not enforced, and it is considered valid.\n</p>\n\n<h3>Example</h3>\n\n<p>The following shows all 17 common validators in action</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ujapev/5\">\n  hm( \"demo\", {\n      registration: {\n        creditcard: \"\",\n        date: \"\",\n        dateISO: \"\",\n        digits: \"\",\n        email: \"\",\n        password:\"\",\n        equal_password: \"\",\n        fixedValue: \"\",\n        max: \"\",\n        maxlength: \"\",\n        min: \"\",\n        minlength: \"\",\n        number: \"\",\n        range: \"\",\n        rangelength: \"\",\n        regex: \"\",\n        url: \"\"\n      }\n    }\n  );\n\n  hm( \"demo.registration\" ).validator( {\n        creditcard: [\"required\", \"creditcard\" ],\n        date: [\"required\", \"date\"],\n        dateISO: [\"required\", \"dateISO\"],\n        digits: [\"required\", \"digits\"],\n        email: [\"required\", \"email\"],\n        password: \"required\",\n        equal_password: [\n          \"required\",\n          //\"..password\" is that subPath to compared node\n          [\"equal\", \"..password,The passwords are not the same.\"]\n          \n        ],\n        fixedValue: [\n          \"required\", \n          [\"fixedValue\", \"ok\"]\n        ],\n        max: [\n          \"required\", \n          [\"max\", 100]\n        ],\n        maxlength: [\n          \"required\", \n          [\"maxlength\", 10]\n        ],\n        min: [\n          \"required\", \n          [\"min\", 100]\n        ],\n        minlength: [\n          \"required\", \n          [\"minlength\", 10]\n        ],\n        number: [\"required\", \"number\"],\n        range: [\n          \"required\", \n          [\"range\", \"10,99\"]\n        ],\n        rangelength: [\n          \"required\", \n          [\"rangelength\", \"10,15\"]\n        ],\n        regex: [\n          \"required\", \n          [\"regex\", \"/\\\\w{10,}/\"]\n        ],\n        url: [\"required\", \"url\"]\n  } );\n</pre>",
        "signatures": []
    },
    {
        "name": "invoke validator",
        "namespace": "plugins.validation",
        "shortDesc": "invoke validator",
        "longDesc": "<p>There are two ways invoke a validator, re-active and pro-active.\n</p>\n<h3>re-active</h3>\n\n<p>When we attach a validator to a model, a subscription is created for the <code>afterUpdate</code> event of the model. When user play with a input widget,  the model's value is changed as result, and the handler of the subscription is triggered, then the validator can be invoked.  This process is re-active.  \n</p>\n\n<h3>pro-active</h3>\n\n<p>A model has multiple properties. To make sure a model (such as \"person\") is valid, we have to make sure all its properties, such as \"firstName\", \"lastName\", \"phoneNumber\" etc are valid. If one of them is invalid, the master model \"person\" is invalid. Initially, validities of these properties are unknown, because user has not yet use the widget to input value yet, and the validator has not been invoked. Even when user has use some input widget to change the properties, we are still unable to determined that master model \"person\" is valid because we are not sure whether all the validators has been been invoked. Because of that we need a method to pro-active invoke the validators for a model and model's properties, and then check whether there is no error generated as a result, then we can be sure that a model is valid. This mode is <code>model.checkValidity()</code>,  it does the same things we just mentioned, and it return true or false. \n</p>\n<h4>model.checkValidity()</h4>\n<p>In the following example, the click events pro-activiely check the validity of registration model by invoking all subscription handlers.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/onehix/9\">\n  hm( \"demo\", {\n      registration: {\n        email: \"\",\n        url: \"\",\n        name: \"\",\n        age: \"\",\n        password: \"\",\n        repeat_password: \"\",\n        accepted: false\n      },\n      checkValidity: function () {\n       var valid = hm(\"demo.registration\").checkValidity();\n        alert(\"validity of registration model is \" + valid);\n      }\n    }\n  );\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n&lt;input type=\"button\" value=\"check is valid\" data-sub=\"$click:/demo.checkValidity\"/&gt;\n</pre>\n\n<h4>checkValidity subscription group</h4>\n<p>You can also use a subscription group checkValidity  to call model.checkValidity() declaratively. If the it return false, the other handler attached to the view will not be executed. The following is the refactory of above sample.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/amafaj/3\">\n&lt;input type=\"button\" value=\"Submit\" data-sub=\"checkValidity:.;alert:..message\"/&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "act on validity",
        "namespace": "plugins.validation",
        "shortDesc": "act on validity",
        "longDesc": "<p>When validators are invoked, they produce some side effects as following.\n</p>\n\n<ol>\n<li>Add error or remove error from queue to <code>model*errors</code> node.</li>\n<li>Add or remove the path of model from the queue <code>*invalidPaths</code></li>\n</ol>\n\n<p>\nHarmony wrap a couple method to leverage these side effects.\n</p>\n\n\n<h3><code>warn</code> group\n</h3>\n<p>This is a subscription group which allow a input widget subscribe the change of model 's error queue. When error queue change, a warning label will be insert after the widget or removed depending whether the error queue's content.\n</p>\n\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/itunol/4\">\n&lt;div&gt;\n  &lt;label&gt;\n  Name:&lt;input type=\"text\" data-sub=\"ns:name;val:.|keyup;warn:.\" /&gt;\n &lt;/label&gt;\n&lt;/div&gt;\n</pre>\n\n<h3>\n<code>warnSummary</code> group\n</h3>\n\n<p>When a node or a node's children change, or <code>node.checkValidity()</code> is called, or <code>node.resetValidity()</code> is called, this will generate summary of of errors. You can control how to render the summary using a template. The data that flow into the template is an array  like <code>[ [error1, error2, ..] ]</code>\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uzeroy/3\">\n &lt;div data-sub=\"warnSummary:demo|errorSummary\"&gt;\n  &lt;/div&gt;\n\n&lt;script type=\"jsrender\" id=\"errorSummary\"&gt;\n{{if #data.length}}\n  &lt;ol class=\"error\"&gt;\n    {{for #data}}\n      &lt;li&gt;{{:#data}}&lt;/li&gt;\n    {{/for}}\n &lt;/ol&gt;  \n{{/if}}    \n&lt;/script&gt;\n</pre>\n\n<h3><code>validityChanged</code> event</h3>\n\n<p>This is a special event. It will be triggered when after the validity of the node has changed.  However, it will not be triggered if the number of errors change from 3 to 2, it will be triggered only when the number change from 0 to a positive number, or from a positive number to 0. The <code>e.proposed</code> returns the validity of the node, <code>e.removed</code> is the oldValidity.  You can use this event to disable the \"submit\" button like the following example.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/elisig/1\">\n&lt;button data-sub=\"\n    checkValidity:.;\n    !validityChanged:.|#styleButton;\n     alert:.|You data is submitted;\"&gt;Submit&lt;/button&gt;    \n</pre>\n<pre data-sub=\"prettyprint:_\">\n  hm(\"demo\", {\n    name: null,\n    phone: null,\n    styleButton: function (e) {\n       this.attr(\"disabled\", !e.proposed); \n    }\n  });\n</pre>\n\n<h3><code>validityChecked</code> event</h3>\n<p>\nThis event will be triggered after <code>node.checkValidity()</code> is called.\n</p>\n\n<h3>\n<code>node.getErrors()</code>\n</h3>\n\n<p>\nThis method will return the errors of a node and its children. However, the result is only guaranteed to be correct only after <code>node.checkValidity()</code> is called. \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/otocak/2\">\n      &lt;button data-sub=\"\n        checkValidity:.;\n        !afterUpdate* validityChecked:.|#printError;\n        !validityChanged:.|#styleButton;\n        alert:.|You data is submitted;\"&gt;Submit&lt;/button&gt;  \n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n  hm(\"demo\", {\n    name: null,\n    phone: null,\n    styleButton: function (e) {\n       this.attr(\"disabled\", !e.proposed);\n    },\n    printError: function (e) {\n      var errors = e.publisher.getErrors();\n      if (errors.length) {\n        hm.log(\"--errors so far ----\");\n        for (var i = 0; i < errors.length; i++) {\n         hm.log(errors[i]);\n        }\n      } else {\n        hm.log(\"---no error yet---\"); \n      }\n    }\n  });\n</pre>\n\n<h3><code>node.resetValidity()</code></h3>\n<p>\nThis method reset the side effect caused by validators, such clear the data in <code>*invalidPaths</code>, and <code>model*errors</code>. It also raise event <code>validityReset</code>.\n</p>\n\n<h3><code>resetValidity</code> event</h3>\n<p>\nThis event will be triggered after node.resetValidity() is called.\n</p>\n\n<h3><code>resetValidity</code> group</h3>\n<p>\nThis group create a subscription that when view is clicked, the model will reset its validity. The following examples, how resetValidity set the side effect caused by validator.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uvumuv/1\">\n\n&lt;button data-sub=\"resetValidity:.\"&gt;reset&lt;/button&gt;\n</pre>\n\n<h3><code>resetFormValidity</code> group</h3>\n<p>\nThis subscription group can be used for <code>form</code> element. When form reset button is clicked, reset event is triggered to the form, the model associated with the form reset its validity. Although, it can be used independently, it should be used together with group <code>resetFormValues</code>.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/obafoj/1\">\n\n  &lt;form data-sub=\"ns:demo.registration;resetFormValues:.;resetFormValidity:.\" novalidate=\"novalidate\"&gt;\n</pre>\n\n<h3><code>resetForm</code> group</h3>\n\n<p>This combination of <code>resetFormValues</code> and <code>resetFormValidity</code>, which is <code>resetFormValues:.;resetFormValidity:.\" </code>. The following use this shortcut.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ufayay/1\">\n&lt;form data-sub=\"ns:demo.registration;resetForm:.\" novalidate=\"novalidate\"&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "reset form values",
        "namespace": "Core.value adapter",
        "shortDesc": "reset form values",
        "longDesc": "<p>\n<code>resetFormValues</code> group can be used with form element. It create a subscription for form reset event, and update the model values with views' values after reset.\n</p>\n<pre data-sub=\"prettyprint:_;preview:_|\">\n&lt;form data-sub=\"ns:myapp.profile;resetFormValues:.\"&gt;\n&lt;/form&gt;\n</pre>",
        "signatures": []
    },
    {
        "name": "Class",
        "namespace": "Core",
        "shortDesc": "hm.Class",
        "longDesc": "<h3>When do we need to use Class</h3>\n\n<p>In JavaScript, we don't need class to build object, because in a lot of case an object is one of a kind, it is not necessary to create a class for the purpose of creating an object. It is more expressive and succinct to use object literal expression to build object. In fact, in ES5, JavaScript does not have class yet. But occasionally,  we need to build lots of objects with the same behaviour, it make sense to use \"class\".  \n</p>\n\n<p><code>hm.Class</code> use the extension concept of <a href=\"http://backbonejs.org/#Model\">Backbone.Model</a>, but it does not have the features such as id, cid, attributes, validation. The <code>hm.Class </code> is just a constructor which builds plain-old JavaScript object, which has minimum features.  What it provides is just a couple of short-cut of object instantiation, inheritance, override. </p>\n<p>\nIn the following, we will use <code>hm.Class</code> to build a Orderline \"class\", The objects created by \"Ordreline\" shared some methods, they are singletons which are member of prototype. In that sense, it is more memory efficient. \n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/edodig/2\">\nvar OrderLine = hm.Class.extend({\n    cid: null,\n    pid: null,\n    qty: 1,\n    price: function () {\n      var pid = this.get(\"pid\");\n      var product = $(products).filter(function () {\n          return this.id == pid;\n      })[0];\n      return product && product.price || \"\";\n    },\n    subTotal: function () {\n      return this.get(\"qty\") * this.get(\"price\");\n    },\n    toJSON: function () {\n      var rtn = this.callBase(\"toJSON\");\n      if (rtn.qty > 0)  {\n        rtn.qty = +rtn.qty;\n        //cid is not needed at server, delete it\n        delete rtn.cid; \n        return rtn;\n      }\n    },\n    productLookup: function () {\n      var cid = this.get(\"cid\");\n      return $(products).filter(function () {\n         return this.cid == cid;\n      });\n    }\n  });\n</pre>\n\n<h3><code>Class.extend()</code></h3>\n\n<p>\nYou can create a new class by using this method, it use the following syntax.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar MyClass = hm.Class.extend(instanceProperties, staticProperpties);\n</pre>\n<p>Just like the example above, the instanceProperties, are inherited by all instance of the new class. While the staticPoperties, will be member of the new class itself.\n</p>\n\n<p>\nThere  are 3 default instance members like follow. They are inherited by the <strong>instance of sub classes</strong>.\n</p>\n<pre data-sub=\"prettyprint:_\">\n{\n  callBase: function () {},\n  initialize: function () {},\n  toJSON: function () {}\n}\n</pre>\n<p>\nThere are 2 default static members like follow. The are inherited by the <strong>sub classes</strong>.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n{\n  list: function () {},\n  extend: function () {}\n}\n</pre>\n\n<h3>Inheritance and override</h3>\n\n<p>This pretty much works in the same way of other language, like the following.</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uzalid/1\">\n  var Class = hm.Class;\n\n  var Person = Class.extend({\n    greet: function () {},\n    toJSON: function () {}\n  }, {\n    create: function () {},\n    list: function () {}\n  });\n\n  var object = Class();\n  var person = Person();\n\n  hm.log(\"----begin ----\");\n  //instance property inheritance\n  hm.log(person.initialize == object.initialize);\n  hm.log(person.greet != null);\n  hm.log(object.greet == null);\n\n  //instance property overirde\n  hm.log(object.toJSON != null);\n  hm.log(person.toJSON != null);\n  hm.log(person.toJSON != object.toJSON);\n\n  //static property inheritance\n  hm.log(Person.extend == Class.extend);\n  hm.log(Person.create != null);\n  hm.log(Class.create == null);\n\n  //static property override\n  hm.log(Class.list != null);\n  hm.log(Person.list != null);\n  hm.log(Person.list != Class.list);\n  hm.log(\"----end ----\");\n</pre>\n\n\n<h3><code>instance.initialize()</code></h3>\n<p>\nThere is a default constructor provided Class provided by <code>Class.prototype.initialize()</code>, what it does is extend the instance with the object passed in the constructor like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar Person = hm.Class.extend();\nvar person = new Person({ firstName: \"John\", lastName: \"Doe\" });\n//\n//person.firstName == \"John\"\n//person.lastName == \"Doe\"\n</pre>\n\n<p>\nBut you can override this behavior by adding a initialize method in the instanceProperties when create a new class.\n</p>\n<pre data-sub=\"prettyprint:_\">\nvar Person = hm.Class.extend({\n  initialize: function( firstName, lastName ) { \n\tthis.firstName = firstName;                  \n\tthis.lastName = lastName;                    \n   }                                            \n});\nvar person = new Person(\"John\", \"Doe\");\n</pre>\n\n<h3><code>instance.callBase(\"baseMember\"[, parameters])</code></h3>\n<p>\nYou can call the base member with <code>instance.callBase</code> method. In the following, we want or constructor to support both of object extension and simple string parameter, so we can use this method.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar Person = hm.Class.extend({\n   initialize: function (firstName, lastName) {\n      if (typeof  firstName == \"string\") {\n           this.firstName = firstName;\n           this.lastName = lastName;\n      } else {\n        this.callBase(\"initialize\", firstName);\n      }\n   }\n});\n\n  var p1 = new Person(\"John\", \"Doe\");\n  var p2 = new Person({\n    firstName: \"John\",\n    lastName: \"Doe\"\n  });\n  //p1.firstName == p2.firstName, p1.lastName == p2.lastName;\n</pre>\n\n<h3>\"new\" is not necessary</h3>\n<p>\nYou can call the constructor with or without the \"new\" keyword, they achieve the same result like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar p1 = Person(\"John\", \"Doe\");\nvar p2 = new Person(\"John\", \"Doe\");\n</pre>\n\n<h3><code>Class.list()</code></h3>\n<p>\nTo create a list of instance of objects, we can use static method <code>Class.list</code> short-cut. The following achieve the same result.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar personList1 = [ \n     new Person({ firstName: \"John\", lastName : \"Doe\" }), \n     new Person( { firstName: \"Jane\", lastName : \"Roe\"})\n];\n\nvar personList2 = Person.list([  \n         [ \"John\", \"Doe\"],\n         [ \"Jane\", \"Roe\"]\n]);\n</pre>\n\n<h3><code>instance.toJSON()</code></h3>\n\n<p>\nThis method is not supposed to be called by developers. Instead it is called when <code>JSON.stringify(instance)</code>. The default behaviour of  this method is to make a copy of the instance and delete the member with \"__\" prefix.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/aqeqar/1\">\n   var obj = {};\n  obj.__privateStuff = \"secrect is visible\";\n  obj.name = \"John\";\n  hm.log(JSON.stringify(obj)); \n \n  obj = hm.Class();\n  obj.__privateStuff = \"I am still here\";\n  obj.name = \"John\";\n  hm.log(JSON.stringify(obj));\n  hm.log(obj.__privateStuff);\n</pre>\n\n<p>\nBut you can override it by adding your own specific logic, like the the OrderLine class.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n  toJSON: function () {\n      var rtn = this.callBase(\"toJSON\");\n      if (rtn.qty > 0)  {\n        rtn.qty = +rtn.qty;\n        //cid is not needed at server, delete it\n        delete rtn.cid; \n        return rtn;\n      }\n    },\n</pre>",
        "signatures": []
    },
    {
        "name": "Entity",
        "namespace": "plugins",
        "shortDesc": "Entity",
        "longDesc": "<p>\nEntity is a sub-class of <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Class\">hm.Class</a>. It can be used to do some CRUD operation with server server,  by default it works with with restful service,  use \"POST\", \"PUT\", \"DELETE\", \"GET\" HTTP method. But its method can be overridden by sub-class. Here is its skeleton.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nhm.Entity = hm.Class.extend(\n//instance members, shared by instance\n{\n  create: function () {},\n  update: function () {},\n  fetch: function () {},\n  destroy: function () {},\n  //save can be called by model node only.\n  save: function () {}\n},\n//static members, shared by class\n{\n  state: enum, //detached, unchanged, added, deleted, modified\n  create: function (instance) {},\n  fetch: function (instance) {},\n  destroy: function (instance) {},\n  save: function (instance) {},\n  getUrl: function (methodName, instance) {},\n  ajax: function (methodName, instance) {}\n});\n</pre>\n<p>\nAll these methods  (except getUrl) return a jqXHR, which is a promise. They can be used independent of repository, like the following.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar Person = hm.Entity.extend(null, { url: \"http://localhost/people\");\nvar person = Person({firstName: \"John\", lastName: \"Doe\" });\nperson.create().done(function () {\n assert(person.id !== undefined, \"server return an id when created\");\n});\nvar persons = Person.fetch();\n//wait for previous call done\nassert(persons.length == 1);\n\n//wait for previous call done\nvar person2 = Person({id: person.id});\nperson2.fetch();\n\n//wait for previous call done\nperson2.firstName = \"Jane\";\nperson2.update();\n//wait for previous call done\nperson2.destroy();\n\n});\n</pre>\n\n<p>We can also put entity into repository, and called these method via node. There also three node extension method like the following. These method will divert the call the the the entity method.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nnode.save();\nnode.fetch();\nnode.destroy();\n</pre>\n\n<p>\nOne benefit to use node is that repository can keep track of its change internally, and update the change properties only, and node will figure it out whether it is update or create.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar people = hm(\"people\", []);\npeople.push(Person({firstName: \"John\", lastName: \"Doe\" });\npeople.cd(0).save(); //this will be create\n\n//wait for previous call done\nvar id = people.cd(0).get(\"id\");\nassert( id !== undefined);\npeople.del(0); //delete it locally\npeople.push(Person({id: id});\npeople.cd(0).fetch(); \n\n//wait for previous call done\npeople.cd(0).set(\"firstName\", \"Jane\");\npeople.cd(0).save(); //this will be a update\n\n//wait for previous call done\npeople.cd(0).destroy(); //this will destroy from the server, and delete it locally\n\n//wait for previous call done\nassert(people.get(0) === undefined);\n</pre>\n\n<h3>Extending Entity</h3>\n<p>You can extend the entity by overriding both the instance method and the static method. But normally, you it is sufficient to override static method, because instance method will be redirect to instance method by default besides some other post-processing in side the instance method. \n</p>\n\n<pre data-sub=\"prettyprint:_\">\nvar Person = hm.Entity.extend(null, {\n   getUrl: function( methodName, instance ) { //overriding },\n   ajax: function (method, instance) { //use other type of web service instead of  restful service }\n});\n</pre>",
        "signatures": []
    },
    {
        "name": "bookmarkable",
        "namespace": "plugins",
        "shortDesc": "bookmarkable",
        "longDesc": "<p>bookmarkable is a plugin that allow you do page-back, page-forward, and book mark the url of you web application. Clicking the Url will restore to the state of your web application, which makes a web application looks like a web page. This bookmarkable depends on <a href=\"http://benalman.com/projects/jquery-bbq-plugin/\">jQuery BBQ</a>.  In the tab plugin, there is an example of <a href=\"http://jsbin.com/asohay/1\">nested tab</a>, however, it can not be book-marked or page-back for page-forward. We can turn this web app into a web page by adding one line of code. Like the following,  click <a target=\"_blank\" href=\"http://jsbin.com/inepuf/1\">here</a> to see the full page, because you need to test in full page.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/inepuf/1\">\n\n\n hm(\"demo\", {\n    category: \"news\",\n    major: \"math\"\n  });\n  \n  //add this line of code.\n  hm.bookmarkable(\"demo.category\", \"demo.major\");\n</pre>\n<h3>Under the hood</h3>\n<p>\nWhat it does is adding some subscriptions to the afterUpdate event of this two node, when they change, update the url, and after the url is change update update the model. The change will not be trigger recursively. And these two node control the tabs behavior. bookmarkable plugins does not know how tab control works what it does is to maintain the synchronization of model value and the url.\nThis document web app also use this plugin.\n</p>",
        "signatures": []
    },
    {
        "name": "build app",
        "namespace": "plugins.App",
        "shortDesc": "build app",
        "longDesc": "<p>To create create an app, we can use the following syntax.</p>\n\n<pre data-sub=\"prettyprint:_\">\n//register default App\nhm.App.add(properties);\n\n//if you have customs app, \nvar SuperApp = hm.App.extend(instanceMembers, staticMembers);\nSuperApp.register(properties);\n</pre>\n\n\n<p><code>hm.App</code> is an constructor extended from <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Class\">hm.Class</a>.  So you can override this by using mechanism defined in <a href=\"/fredyang/harmony/doc/doc.html#api.apiAction=view&api.selectedEntryName=Core.Class\">hm.Class</a>. <code>hm.App</code> has defined some boilerplate code which does the work of  bootstraping, shutting down. When we create our app, we just need to implement the missing parts or override the existing parts. The following is instance member of an app. All of them can be overridden,  but in most of case we just need to override a few of them.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\n{\n  bootstrap: function( viewContainer, modelContainer, options ) {},\n\n  shutdown: function( viewContainer, modelContainer ) {},\n\n  fetchRootData: null, //function( modelContainer, options ) {}\n\n  buildRootModel: function( modelContainer, options ) {},\n\n  destroyRootModel: function( modelContainer ) {},\n\n  buildRootView: function( viewContainer, modelContainer ) {},\n\n  destroyRootView: function( viewContainer ) {},\n\n  getTemplateOptions: function() {},\n\n  getNamespace: function( modelContainer ) {},\n\n  initialize: function( seed ) {},\n\n  instanceCount: 0,\n\n  loadable: function () {return true;}\n\n  templateOptions: null,\n\n  modelName: null,\n\n  name: null\n}\n</pre>\n\n\n<h3>Example</h3>\n\n<h4>fetchRootData</h4>\n<p>The follow is simple app, there is only one interesting method \"fetchRootData\", which return the a data,  and we use declarative syntax to bootstrap an app instance.\n<p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ahoxer/2\">\nhm.App.add({\n    name: \"helloApp\",\n    fetchRootData: function( modelContainer, options ) {\n      return { name: \"John\" };\n    }\n  });\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n&lt;script type=\"jsrender\" id=\"helloApp\"&gt;\n &lt;h1&gt;hello, {{:name}}&lt;/h1&gt;\n&lt;/script&gt;\n\n&lt;div data-sub=\"app:demo|helloApp\"&gt;&lt;/div&gt;\n</pre>\n\n<p>\nWe can see that the bootstrapping process use lots default behaviour implemented by the above methods, such as add the data at a sub path \"helloApp\" of the to model container, \"demo\", render the mark-up using model \"demo.helloApp\" and template of id \"helloApp\", and wrap the mark-up under view container. All these behaviour are customizable.\n</p>\n\n<h4>Customize app instance with options</h4>\n<p>\nThe following example shows to to customize an app instance by using the options parameter, which follows the app name.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/inevuh/1\">\n\n&lt;div data-sub=\"app:demo|helloApp,hi\"&gt;&lt;/div&gt;\n</pre>\n<pre data-sub=\"prettyprint:_;\">\n \n  hm.App.add({\n    name: \"helloApp\",\n    fetchRootData: function( modelContainer, options ) {\n      return { name: \"John\", greeting: options };\n    }\n  });\n</pre>\n\n<h4>Getting data asynchronously</h4>\n<p>In real application, the data should be from a service instead of hard-coded in the app definition, like previous examples. The following example use ajax to get data from service, and return a promise.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uhuwag/2\">\nhm.App.add({\n    name: \"helloApp\",\n    fetchRootData: function( modelContainer, options ) {\n      return $.getJSON(\"getHelloAppData\", options);\n    }     \n  });\n</pre>\n\n<h4>Fetching app definition before bootstrapping</h4>\n\n<p>In the previous examples, the app definition is already available when bootstrapping the app is requested. It is supported to dynamically to load the app definition when it is not available. In the following example, app definition is hosted at <code>~app/hellApp.js</code>, and the template is hosted at <code>~template/helloApp/main.js</code>. They will be fetched by matrix.js using $.ajax. And this is simulated with ajaxMock.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/otumar/2\">\n\nmap(\"template/helloApp/main.html\", \"..content of the template ..\");\nmap(\"app/helloApp.js\", \"..content of the app definition ..\");\n</pre>\n\n<h4>Customize how root model is build</h4>\n\n<p>\nIn the previous examples, they only take care how to fetch the data, and use the default <code>app.buildRootModel()</code> to build model with the data. The following example override buildRootModel(), and control both how to get data and build model with the data.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/ixojom/1\">\n  hm.App.add({\n    name: \"helloApp\",\n    buildRootModel: function( modelContainer, options ) {\n      //this.getNamesapce is provided App.prototype\n      var namespace = this.getNamespace(modelContainer);\n      return $.getJSON(\"getHelloAppData\", options).done(\n         function (data) {\n          hm(namespace).set(data);\n      });\n    }  \n  });\n</pre>\n\n<h4>Customize how root view is build</h4>\n\n<p>By default, the <code>app.buildRootView()</code> use <code>*renderContent</code> workflow type, to render the view,  which generate mark-up with model and template, and then replace the content of view container with the mark-up.\n</p>\n\n<pre data-sub=\"prettyprint:_\">\nbuildRootView: function (viewContainer, modelContainer) {\n  $(viewContainer).renderContent(\n  this.getTemplateOptions(),\n  this.getNamespace(modelContainer))                                                 \n</pre>\n\n<pre data-sub=\"prettyprint:_\">\nrenderContent = {\n  initialize: \"*templateOptions\",\n  get: \"get\", \n  convert: \"*dataToMarkup\",\n  set: \"html\", //this will replace content with mark-up\n  finalize: \"*parseSub\"\n};\n</pre>\n\n<p>\nIf we already have contents in the container, we might want to use different way to render the root view. The following examples, how to customize the root view rendering.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/uneqit/1\">\n  &lt;div data-sub=\"app:demo|helloApp,hi\"&gt;\n    &lt;p&gt;Some existing content already here, \n      we don't want this to be removed by helloApp&lt;/p&gt;\n  &lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_;preview:_|\">\nbuildRootView: function (viewContainer, modelContainer) {\n  $(viewContainer).renderContent(\n  this.getTemplateOptions(),\n  this.getNamespace(modelContainer), {\n    set: \"append\"\n  });\n}\n</pre>\n\n<h4>Bootstrap and shut down an app instance on demand</h4>\n<p>The previous examples bootstrap app when page loads. In the following example, user can determine when to load the app and when to shut down the app.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/efihul/1\">\n\n\n&lt;div id=\"demo\" data-sub=\"ns:demo\"&gt;\n  &lt;button data-sub=\"$click:loadApp\"&gt;bootstrap helloApp&lt;/button&gt;\n  &lt;button data-sub=\"$click:shutdownApp\"&gt;shutdown helloApp&lt;/button&gt;\n&lt;/div&gt;\n</pre>\n\n<pre data-sub=\"prettyprint:_\">\n  hm(\"demo\", {\n    loadApp: function () {\n      hm.App.bootstrap(\"helloApp\", $(\"#demo\"), \"demo\", \"hi\");\n    },\n    shutdownApp: function () {\n      hm.App.shutdown(\"helloApp\", $(\"#demo\"));\n    }\n  });\n</pre>\n\n<h4>Customize how to destroy root view</h4>\n\n<p>\nThe default behaviour of destroy root view is to empty the container, it is correct for a lot of case, but not in previous example. However this behaviour can be overridden, like the following. But we also need a little help from <code>buildRootView()</code> method.\n</p>\n\n<pre data-sub=\"prettyprint:_;preview:_|http://jsbin.com/usodux/1\">\n\n\nbuildRootView: function (viewContainer, modelContainer) {\n  $(viewContainer).renderContent(\n  this.getTemplateOptions(),\n  this.getNamespace(modelContainer), {\n    set: function (markup, e) {\n      $(\"&lt;div class='helloApp'&gt;&lt;/div&gt;\")\n        .append(markup)\n        .appendTo(e.subscriber);\n    }\n  });\n},\n\ndestroyRootView: function (viewContainer) {\n  $(viewContainer).find(\".helloApp\").remove();\n}\n</pre>",
        "signatures": []
    }
]