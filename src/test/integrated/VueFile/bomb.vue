<template>
<u-linear-layout direction="vertical">
    <div>子页面</div>
    <router-view></router-view>*(J)
    <u-table-view ref="tableView" :data-source="load" pageable remote-paging>
        <u-table-view-column type="index" width="60" title="序号"></u-table-view-column>
        <u-table-view-column title="姓名" field="userInfo.UserName"></u-table-view-column>
        <u-table-view-column title="手机" field="userInfo.Phone"></u-table-view-column>
        <u-table-view-column title="工号" field="userInfo.UserInfoExtend.工号"></u-table-view-column>
        <u-table-view-column title="身份证" field="userInfo.UserInfoExtend.身份证"></u-table-view-column>
        <u-table-view-column title="status" field="variables.status"></u-table-view-column>
        <u-table-view-column title="accommodationAgreement" field="variables.accommodationAgreement"></u-table-view-column>
        <u-table-view-column title="deposit" field="variables.deposit"></u-table-view-column>
        <u-table-view-column title="cost" field="variables.cost"></u-table-view-column>
        <u-table-view-column title="room" field="room"></u-table-view-column>
        <u-table-view-column title="applyContent" field="variables.applyContent"></u-table-view-column>
        <u-table-view-column title="创建时间" field="variables.createdTime" formatter="date('YYYY-MM-DD HH:mm:ss')"></u-table-view-column>
        <u-table-view-column title="更新时间" field="variables.updatedTime" formatter="date('YYYY-MM-DD HH:mm:ss')"></u-table-view-column>
        <u-table-view-column title="操作">
            <template #cell="scope">
                <u-linear-layout gap="small">
                    <u-link @click="openAccept($event,scope)">通过</u-link>
                    <u-link>驳回</u-link>
                </u-linear-layout>
            </template>
        </u-table-view-column>
    </u-table-view>
    <u-modal ref="modal1" size="large">
        <template #title>
            <div>审核通过</div>
        </template>
        <template #body>
            <div>内容</div>
            <u-info-list>
                <u-info-list-group title="申请人信息">
                    <u-info-list-item label="申请人">{{roomApplyItem.userInfo.UserId}}</u-info-list-item>
                    <u-info-list-item label="工号">{{roomApplyItem.userInfo.UserInfoExtend.工号}}</u-info-list-item>
                </u-info-list-group>
                <u-info-list-group title="房间信息">
                    <u-info-list-item label="押金">{{roomApplyItem.variables.deposit}}</u-info-list-item>
                    <u-info-list-item label="租金">{{roomApplyItem.variables.cost}}</u-info-list-item>
                </u-info-list-group>
            </u-info-list>
        </template>
        <template #foot>
            <u-linear-layout>
                <u-button color="primary" @click="accept($event)">确定</u-button>
                <u-button>取消</u-button>
            </u-linear-layout>
        </template>
    </u-modal>
</u-linear-layout></template><script>
export default {};</script>
<definition>
{
    "params": [],
    "variables": [
        {
            "level": "variable",
            "type": "Identifier",
            "name": "roomApplyItem",
            "description": "",
            "schema": {
                "$ref": "#/flowend925/structures/ProcessTask"
            },
            "isLeaf": true,
            "existingNames": [
                "abstract",
                "in",
                "double",
                "arguments",
                "boolean",
                "break",
                "byte",
                "case",
                "catch",
                "char",
                "class*",
                "const",
                "continue",
                "debugger",
                "default",
                "delete",
                "do",
                "else",
                "enum*",
                "eval",
                "export*",
                "extends*",
                false,
                "final",
                "finally",
                "float",
                "for",
                "function",
                "goto",
                "if",
                "implements",
                "import*",
                "instanceof",
                "int",
                "interface",
                "let",
                "long",
                "native",
                "new",
                null,
                "package",
                "private",
                "protected",
                "public",
                "return",
                "short",
                "static",
                "super*",
                "switch",
                "synchronized",
                "this",
                "throw",
                "throws",
                "transient",
                true,
                "try",
                "typeof",
                "var",
                "void",
                "volatile",
                "while",
                "with",
                "yield",
                "load",
                "params",
                "result",
                "res",
                "apiUser",
                "remove",
                "event",
                "scope",
                "res",
                "openAccept",
                "event",
                "scope"
            ],
            "init": {
                "type": "ObjectExpression",
                "properties": [
                    {
                        "type": "ObjectProperty",
                        "key": {
                            "type": "Identifier",
                            "name": "id"
                        },
                        "value": {
                            "type": "Identifier",
                            "name": "undefined"
                        }
                    },
                    {
                        "type": "ObjectProperty",
                        "key": {
                            "type": "Identifier",
                            "name": "processDefinitionId"
                        },
                        "value": {
                            "type": "Identifier",
                            "name": "undefined"
                        }
                    },
                    {
                        "type": "ObjectProperty",
                        "key": {
                            "type": "Identifier",
                            "name": "taskDefinitionKey"
                        },
                        "value": {
                            "type": "Identifier",
                            "name": "undefined"
                        }
                    },
                    {
                        "type": "ObjectProperty",
                        "key": {
                            "type": "Identifier",
                            "name": "variables"
                        },
                        "value": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "id"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "userId"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "status"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "accommodationAgreement"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "deposit"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "cost"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "waterMode"
                                    },
                                    "value": {
                                        "type": "StringLiteral",
                                        "value": "USED"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "waterPrice"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "electricityMode"
                                    },
                                    "value": {
                                        "type": "StringLiteral",
                                        "value": "USED"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "electricityPrice"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "hotWaterMode"
                                    },
                                    "value": {
                                        "type": "StringLiteral",
                                        "value": "USED"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "hotWaterPrice"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "pay"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "reject"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "rejectMark"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "room"
                                    },
                                    "value": {
                                        "type": "ObjectExpression",
                                        "properties": [
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "id"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "location"
                                                },
                                                "value": {
                                                    "type": "ObjectExpression",
                                                    "properties": [
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "id"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "name"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "distribution"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "AUTO"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "applyDocument"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "YES"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "applyOutDocument"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "YES"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "payMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "ONLINE"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "waterMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "USED"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "waterPrice"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "electricityMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "USED"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "electricityPrice"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "hotWaterMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "USED"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "hotWaterPrice"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "createdTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "updatedTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "building"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "floor"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "roomNo"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "roomType"
                                                },
                                                "value": {
                                                    "type": "ObjectExpression",
                                                    "properties": [
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "id"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "name"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "location"
                                                            },
                                                            "value": {
                                                                "type": "ObjectExpression",
                                                                "properties": [
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "id"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "name"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "distribution"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "AUTO"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "applyDocument"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "YES"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "applyOutDocument"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "YES"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "payMode"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "ONLINE"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "waterMode"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "USED"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "waterPrice"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "electricityMode"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "USED"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "electricityPrice"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "hotWaterMode"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "USED"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "hotWaterPrice"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "createdTime"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "updatedTime"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "createdTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "updatedTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "genderType"
                                                },
                                                "value": {
                                                    "type": "StringLiteral",
                                                    "value": "MALE"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "bedCount"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "bedLeft"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "orientation"
                                                },
                                                "value": {
                                                    "type": "StringLiteral",
                                                    "value": "EAST"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "bed"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "chair"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "table"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "aircondition"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "television"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "refrigerator"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "cost"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "deposit"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "users"
                                                },
                                                "value": {
                                                    "type": "ObjectExpression",
                                                    "properties": [
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "id"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "userId"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "applyId"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "createdTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "updatedTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "room"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "status"
                                                },
                                                "value": {
                                                    "type": "StringLiteral",
                                                    "value": "ENABLED"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "description"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "pictures"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "createdTime"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "updatedTime"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "applyContent"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "createdTime"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "updatedTime"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "type": "ObjectProperty",
                        "key": {
                            "type": "Identifier",
                            "name": "userInfo"
                        },
                        "value": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Status"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "LastLoginTime"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "UserInfoExtend"
                                    },
                                    "value": {
                                        "type": "ObjectExpression",
                                        "properties": [
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "工号"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "身份证"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "UserName"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "UserId"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "CreateTime"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "UpdateTime"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "LoginCount"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Source"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Email"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Phone"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
    ],
    "lifecycles": [],
    "logics": [
        {
            "level": "logic",
            "name": "load",
            "definition": {
                "params": [
                    {
                        "level": "variable",
                        "name": "params",
                        "schema": {
                            "$ref": "#/systemTypes/DataSourceParams"
                        },
                        "init": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "page"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "size"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "sort"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "order"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                }
                            ]
                        }
                    }
                ],
                "returns": [
                    {
                        "level": "return",
                        "name": "result",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/flowend925/structures/ProcessTask"
                            }
                        },
                        "init": {
                            "type": "ArrayExpression",
                            "elements": []
                        }
                    }
                ],
                "variables": [
                    {
                        "level": "variable",
                        "name": "res",
                        "schema": {
                            "$ref": "#/flowend925/structures/ApiReturnOfProcess"
                        },
                        "init": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "code"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "data"
                                    },
                                    "value": {
                                        "type": "ArrayExpression",
                                        "elements": []
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "message"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "level": "variable",
                        "type": "Identifier",
                        "name": "apiUser",
                        "description": "",
                        "schema": {
                            "$ref": "#/flowfront0928/structures/ApiReturnOfGetUser"
                        },
                        "isLeaf": true,
                        "init": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "RequestId"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Message"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Data"
                                    },
                                    "value": {
                                        "type": "ObjectExpression",
                                        "properties": [
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "Status"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "LastLoginTime"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "UserInfoExtend"
                                                },
                                                "value": {
                                                    "type": "ObjectExpression",
                                                    "properties": [
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "工号"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "身份证"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "UserName"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "UserId"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "CreateTime"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "UpdateTime"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "LoginCount"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "Source"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "Email"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "Phone"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            }
                                        ]
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "Code"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                }
                            ]
                        },
                        "existingNames": [
                            "abstract",
                            "in",
                            "double",
                            "arguments",
                            "boolean",
                            "break",
                            "byte",
                            "case",
                            "catch",
                            "char",
                            "class*",
                            "const",
                            "continue",
                            "debugger",
                            "default",
                            "delete",
                            "do",
                            "else",
                            "enum*",
                            "eval",
                            "export*",
                            "extends*",
                            false,
                            "final",
                            "finally",
                            "float",
                            "for",
                            "function",
                            "goto",
                            "if",
                            "implements",
                            "import*",
                            "instanceof",
                            "int",
                            "interface",
                            "let",
                            "long",
                            "native",
                            "new",
                            null,
                            "package",
                            "private",
                            "protected",
                            "public",
                            "return",
                            "short",
                            "static",
                            "super*",
                            "switch",
                            "synchronized",
                            "this",
                            "throw",
                            "throws",
                            "transient",
                            true,
                            "try",
                            "typeof",
                            "var",
                            "void",
                            "volatile",
                            "while",
                            "with",
                            "yield",
                            "load",
                            "remove"
                        ]
                    }
                ],
                "body": [
                    {
                        "level": "logicNode",
                        "type": "Start"
                    },
                    {
                        "level": "logicNode",
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "level": "logicNode",
                            "type": "Identifier",
                            "name": "res",
                            "index": 1602768981727
                        },
                        "right": {
                            "level": "logicNode",
                            "type": "CallFlow",
                            "label": "调用流程",
                            "action": "getList",
                            "processDefinitionKey": "zhuxiushenqing",
                            "taskId": null,
                            "processInstanceId": null,
                            "variables": null,
                            "schemaRef": null,
                            "arguments": [],
                            "offsetX": 591,
                            "offsetY": 198
                        }
                    },
                    {
                        "level": "logicNode",
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "level": "expressionNode",
                            "type": "Identifier",
                            "name": "result",
                            "index": 1602768981861
                        },
                        "right": {
                            "level": "expressionNode",
                            "type": "MemberExpression",
                            "name": "res",
                            "index": 1602768981974,
                            "object": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "res",
                                "index": 1602768981974
                            },
                            "property": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "data"
                            }
                        }
                    },
                    {
                        "level": "logicNode",
                        "type": "ForEachStatement",
                        "label": "循环分支",
                        "each": {
                            "level": "expressionNode",
                            "type": "Identifier",
                            "name": "result",
                            "index": 1602768982159,
                            "object": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "res",
                                "index": 1602766368375
                            },
                            "property": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "data"
                            }
                        },
                        "item": {
                            "level": "expressionNode",
                            "type": "Identifier",
                            "name": "item",
                            "editable": true,
                            "schema": {
                                "$ref": "#/flowend925/structures/ProcessTask"
                            }
                        },
                        "index": {
                            "level": "expressionNode",
                            "type": "Identifier",
                            "name": "i",
                            "editable": true
                        },
                        "start": {
                            "level": "expressionNode",
                            "type": "NumericLiteral",
                            "value": 1
                        },
                        "end": {
                            "level": "expressionNode",
                            "type": "MemberExpression",
                            "name": "name",
                            "hide": false,
                            "index": 1602768982336,
                            "offsetX": 395.90625,
                            "offsetY": 1033,
                            "object": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "result",
                                "index": 1602768982336
                            },
                            "property": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "length"
                            },
                            "arrayLength": true
                        },
                        "body": [
                            {
                                "level": "logicNode",
                                "type": "AssignmentExpression",
                                "label": "赋值",
                                "operator": "=",
                                "left": {
                                    "level": "expressionNode",
                                    "type": "Identifier",
                                    "name": "apiUser",
                                    "index": 1602768982586
                                },
                                "right": {
                                    "level": "logicNode",
                                    "type": "CallInterface",
                                    "label": "调用接口",
                                    "params": [
                                        {
                                            "name": "UserId",
                                            "in": "query",
                                            "value": {
                                                "level": "expressionNode",
                                                "type": "MemberExpression",
                                                "name": "name",
                                                "hide": false,
                                                "index": 1602768983577,
                                                "object": {
                                                    "level": "expressionNode",
                                                    "type": "MemberExpression",
                                                    "object": {
                                                        "level": "expressionNode",
                                                        "type": "Identifier",
                                                        "name": "item",
                                                        "index": 1602768983577
                                                    },
                                                    "property": {
                                                        "level": "expressionNode",
                                                        "type": "Identifier",
                                                        "name": "variables"
                                                    },
                                                    "index": 1602768983577
                                                },
                                                "property": {
                                                    "level": "expressionNode",
                                                    "type": "Identifier",
                                                    "name": "userId"
                                                }
                                            },
                                            "schema": {
                                                "type": "string",
                                                "format": ""
                                            }
                                        }
                                    ],
                                    "selectedParams": [
                                        {
                                            "name": "UserId",
                                            "in": "query",
                                            "description": "用户唯一ID",
                                            "required": false,
                                            "type": "string",
                                            "level": "param",
                                            "schema": {
                                                "type": "string",
                                                "format": ""
                                            }
                                        }
                                    ],
                                    "interfaceKey": "flowfront0928/GetUser"
                                }
                            },
                            {
                                "level": "logicNode",
                                "type": "AssignmentExpression",
                                "label": "赋值",
                                "operator": "=",
                                "left": {
                                    "level": "expressionNode",
                                    "type": "MemberExpression",
                                    "name": "item",
                                    "index": 1602768983846,
                                    "object": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "item",
                                        "index": 1602768983846
                                    },
                                    "property": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "userInfo"
                                    }
                                },
                                "right": {
                                    "level": "expressionNode",
                                    "type": "MemberExpression",
                                    "name": "name",
                                    "hide": false,
                                    "index": 1602768984045,
                                    "object": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "apiUser",
                                        "index": 1602768984045
                                    },
                                    "property": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "Data"
                                    }
                                }
                            }
                        ]
                    },
                    {
                        "level": "logicNode",
                        "type": "End"
                    }
                ],
                "playground": [
                    {
                        "level": "logicNode",
                        "type": "CallGraphQL",
                        "label": "数据查询",
                        "action": "query",
                        "schemaRef": "#/flowend925/entities/RoomApply",
                        "resolverName": "getAllRoomApplies",
                        "params": [],
                        "querySchemaMap": {
                            "name": "Data",
                            "description": "",
                            "type": "object",
                            "format": "",
                            "$ref": "#/flowend925/structures/PageOfRoomApply",
                            "level": "structure",
                            "checked": true,
                            "properties": {
                                "content": {
                                    "name": "content",
                                    "description": "",
                                    "type": "array",
                                    "level": "entity",
                                    "items": {
                                        "$ref": "#/flowend925/entities/RoomApply",
                                        "level": "entity",
                                        "type": "object",
                                        "properties": {
                                            "id": {
                                                "name": "id",
                                                "description": "主键",
                                                "type": "integer",
                                                "format": "long",
                                                "isLeaf": true,
                                                "editable": false,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "userId": {
                                                "name": "userId",
                                                "description": "用户 ID",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "status": {
                                                "name": "status",
                                                "description": "工单状态",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "accommodationAgreement": {
                                                "name": "accommodationAgreement",
                                                "description": "签署协议",
                                                "type": "boolean",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "deposit": {
                                                "name": "deposit",
                                                "description": "押金",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "cost": {
                                                "name": "cost",
                                                "description": "每月房租",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "waterMode": {
                                                "name": "waterMode",
                                                "description": "",
                                                "type": "enum",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/BillMode",
                                                "isLeaf": true,
                                                "level": "entity",
                                                "checked": true,
                                                "enumItems": {
                                                    "USED": "单价收费",
                                                    "MONTHLY": "月度收费"
                                                }
                                            },
                                            "waterPrice": {
                                                "name": "waterPrice",
                                                "description": "",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "electricityMode": {
                                                "name": "electricityMode",
                                                "description": "",
                                                "type": "enum",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/BillMode",
                                                "isLeaf": true,
                                                "level": "entity",
                                                "checked": true,
                                                "enumItems": {
                                                    "USED": "单价收费",
                                                    "MONTHLY": "月度收费"
                                                }
                                            },
                                            "electricityPrice": {
                                                "name": "electricityPrice",
                                                "description": "",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "hotWaterMode": {
                                                "name": "hotWaterMode",
                                                "description": "",
                                                "type": "enum",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/BillMode",
                                                "isLeaf": true,
                                                "level": "entity",
                                                "checked": true,
                                                "enumItems": {
                                                    "USED": "单价收费",
                                                    "MONTHLY": "月度收费"
                                                }
                                            },
                                            "hotWaterPrice": {
                                                "name": "hotWaterPrice",
                                                "description": "",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "pay": {
                                                "name": "pay",
                                                "description": "支付凭证",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "reject": {
                                                "name": "reject",
                                                "description": "",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "rejectMark": {
                                                "name": "rejectMark",
                                                "description": "",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "room": {
                                                "name": "room",
                                                "description": "",
                                                "type": "object",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/Room",
                                                "isLeaf": true,
                                                "relationship": "ManyToOne",
                                                "level": "entity",
                                                "checked": true,
                                                "properties": {
                                                    "id": {
                                                        "name": "id",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "long",
                                                        "isLeaf": true,
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "location": {
                                                        "name": "location",
                                                        "description": "",
                                                        "type": "object",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/Location",
                                                        "isLeaf": true,
                                                        "relationship": "ManyToOne",
                                                        "label": "地点",
                                                        "level": "entity",
                                                        "checked": true,
                                                        "properties": {
                                                            "id": {
                                                                "name": "id",
                                                                "description": "主键",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "name": {
                                                                "name": "name",
                                                                "description": "",
                                                                "type": "string",
                                                                "format": "",
                                                                "isLeaf": true,
                                                                "label": "地点名称",
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "distribution": {
                                                                "name": "distribution",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/Distribution",
                                                                "isLeaf": true,
                                                                "label": "分配方式",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "AUTO": "自动",
                                                                    "MANUAL": "手动"
                                                                }
                                                            },
                                                            "applyDocument": {
                                                                "name": "applyDocument",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/ApplyDocument",
                                                                "isLeaf": true,
                                                                "label": "申请资料",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "YES": "需要",
                                                                    "NO": "不需要"
                                                                }
                                                            },
                                                            "applyOutDocument": {
                                                                "name": "applyOutDocument",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/ApplyOutDocument",
                                                                "isLeaf": true,
                                                                "label": "退宿资料",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "YES": "必填",
                                                                    "NO": "选填"
                                                                }
                                                            },
                                                            "payMode": {
                                                                "name": "payMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/PayMode",
                                                                "isLeaf": true,
                                                                "label": "支付方式",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "ONLINE": "在线支付",
                                                                    "OFFLINE": "线下缴费"
                                                                }
                                                            },
                                                            "waterMode": {
                                                                "name": "waterMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/BillMode",
                                                                "isLeaf": true,
                                                                "label": "冷水费",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "USED": "单价收费",
                                                                    "MONTHLY": "月度收费"
                                                                }
                                                            },
                                                            "waterPrice": {
                                                                "name": "waterPrice",
                                                                "description": "",
                                                                "type": "number",
                                                                "format": "double",
                                                                "isLeaf": true,
                                                                "label": "冷水价格",
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "electricityMode": {
                                                                "name": "electricityMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/BillMode",
                                                                "isLeaf": true,
                                                                "label": "电费",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "USED": "单价收费",
                                                                    "MONTHLY": "月度收费"
                                                                }
                                                            },
                                                            "electricityPrice": {
                                                                "name": "electricityPrice",
                                                                "description": "",
                                                                "type": "number",
                                                                "format": "double",
                                                                "isLeaf": true,
                                                                "label": "电费价格",
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "hotWaterMode": {
                                                                "name": "hotWaterMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/BillMode",
                                                                "isLeaf": true,
                                                                "label": "热水费",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "enumItems": {
                                                                    "USED": "单价收费",
                                                                    "MONTHLY": "月度收费"
                                                                }
                                                            },
                                                            "hotWaterPrice": {
                                                                "name": "hotWaterPrice",
                                                                "description": "",
                                                                "type": "number",
                                                                "format": "double",
                                                                "isLeaf": true,
                                                                "label": "热水价格",
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "createdTime": {
                                                                "name": "createdTime",
                                                                "description": "创建时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "label": "创建时间",
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "updatedTime": {
                                                                "name": "updatedTime",
                                                                "description": "更新时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "label": "更新时间",
                                                                "level": "property",
                                                                "checked": true
                                                            }
                                                        }
                                                    },
                                                    "building": {
                                                        "name": "building",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "楼栋",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "floor": {
                                                        "name": "floor",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "楼层",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "roomNo": {
                                                        "name": "roomNo",
                                                        "description": "房间号",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "房号",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "roomType": {
                                                        "name": "roomType",
                                                        "description": "",
                                                        "type": "object",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/RoomType",
                                                        "isLeaf": true,
                                                        "relationship": "ManyToOne",
                                                        "label": "房间类型",
                                                        "level": "entity",
                                                        "checked": true,
                                                        "properties": {
                                                            "id": {
                                                                "name": "id",
                                                                "description": "主键",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "name": {
                                                                "name": "name",
                                                                "description": "",
                                                                "type": "string",
                                                                "format": "",
                                                                "isLeaf": true,
                                                                "label": "房间类型",
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "location": {
                                                                "name": "location",
                                                                "description": "",
                                                                "type": "object",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/Location",
                                                                "isLeaf": true,
                                                                "relationship": "ManyToOne",
                                                                "label": "地点",
                                                                "level": "entity",
                                                                "checked": true,
                                                                "properties": {
                                                                    "id": {
                                                                        "name": "id",
                                                                        "description": "主键",
                                                                        "type": "integer",
                                                                        "format": "long",
                                                                        "isLeaf": true,
                                                                        "editable": false,
                                                                        "level": "property",
                                                                        "checked": true
                                                                    },
                                                                    "name": {
                                                                        "name": "name",
                                                                        "description": "",
                                                                        "type": "string",
                                                                        "format": "",
                                                                        "isLeaf": true,
                                                                        "label": "地点名称",
                                                                        "level": "property",
                                                                        "checked": true
                                                                    },
                                                                    "distribution": {
                                                                        "name": "distribution",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/Distribution",
                                                                        "isLeaf": true,
                                                                        "label": "分配方式",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "AUTO": "自动",
                                                                            "MANUAL": "手动"
                                                                        }
                                                                    },
                                                                    "applyDocument": {
                                                                        "name": "applyDocument",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/ApplyDocument",
                                                                        "isLeaf": true,
                                                                        "label": "申请资料",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "YES": "需要",
                                                                            "NO": "不需要"
                                                                        }
                                                                    },
                                                                    "applyOutDocument": {
                                                                        "name": "applyOutDocument",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/ApplyOutDocument",
                                                                        "isLeaf": true,
                                                                        "label": "退宿资料",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "YES": "必填",
                                                                            "NO": "选填"
                                                                        }
                                                                    },
                                                                    "payMode": {
                                                                        "name": "payMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/PayMode",
                                                                        "isLeaf": true,
                                                                        "label": "支付方式",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "ONLINE": "在线支付",
                                                                            "OFFLINE": "线下缴费"
                                                                        }
                                                                    },
                                                                    "waterMode": {
                                                                        "name": "waterMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/BillMode",
                                                                        "isLeaf": true,
                                                                        "label": "冷水费",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "USED": "单价收费",
                                                                            "MONTHLY": "月度收费"
                                                                        }
                                                                    },
                                                                    "waterPrice": {
                                                                        "name": "waterPrice",
                                                                        "description": "",
                                                                        "type": "number",
                                                                        "format": "double",
                                                                        "isLeaf": true,
                                                                        "label": "冷水价格",
                                                                        "level": "property",
                                                                        "checked": true
                                                                    },
                                                                    "electricityMode": {
                                                                        "name": "electricityMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/BillMode",
                                                                        "isLeaf": true,
                                                                        "label": "电费",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "USED": "单价收费",
                                                                            "MONTHLY": "月度收费"
                                                                        }
                                                                    },
                                                                    "electricityPrice": {
                                                                        "name": "electricityPrice",
                                                                        "description": "",
                                                                        "type": "number",
                                                                        "format": "double",
                                                                        "isLeaf": true,
                                                                        "label": "电费价格",
                                                                        "level": "property",
                                                                        "checked": true
                                                                    },
                                                                    "hotWaterMode": {
                                                                        "name": "hotWaterMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/BillMode",
                                                                        "isLeaf": true,
                                                                        "label": "热水费",
                                                                        "level": "entity",
                                                                        "checked": true,
                                                                        "enumItems": {
                                                                            "USED": "单价收费",
                                                                            "MONTHLY": "月度收费"
                                                                        }
                                                                    },
                                                                    "hotWaterPrice": {
                                                                        "name": "hotWaterPrice",
                                                                        "description": "",
                                                                        "type": "number",
                                                                        "format": "double",
                                                                        "isLeaf": true,
                                                                        "label": "热水价格",
                                                                        "level": "property",
                                                                        "checked": true
                                                                    },
                                                                    "createdTime": {
                                                                        "name": "createdTime",
                                                                        "description": "创建时间",
                                                                        "type": "string",
                                                                        "format": "date-time",
                                                                        "isLeaf": true,
                                                                        "editable": false,
                                                                        "label": "创建时间",
                                                                        "level": "property",
                                                                        "checked": true
                                                                    },
                                                                    "updatedTime": {
                                                                        "name": "updatedTime",
                                                                        "description": "更新时间",
                                                                        "type": "string",
                                                                        "format": "date-time",
                                                                        "isLeaf": true,
                                                                        "editable": false,
                                                                        "label": "更新时间",
                                                                        "level": "property",
                                                                        "checked": true
                                                                    }
                                                                }
                                                            },
                                                            "createdTime": {
                                                                "name": "createdTime",
                                                                "label": "创建时间",
                                                                "description": "创建时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "updatedTime": {
                                                                "name": "updatedTime",
                                                                "label": "更新时间",
                                                                "description": "更新时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            }
                                                        }
                                                    },
                                                    "genderType": {
                                                        "name": "genderType",
                                                        "description": "",
                                                        "type": "enum",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/RoomGenderType",
                                                        "isLeaf": true,
                                                        "label": "房间类别",
                                                        "level": "entity",
                                                        "checked": true,
                                                        "enumItems": {
                                                            "MALE": "男寝",
                                                            "FEMALE": "女寝"
                                                        }
                                                    },
                                                    "bedCount": {
                                                        "name": "bedCount",
                                                        "description": "床位总数",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "床位总数",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "bedLeft": {
                                                        "name": "bedLeft",
                                                        "description": "床位剩余",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "床位剩余",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "orientation": {
                                                        "name": "orientation",
                                                        "description": "",
                                                        "type": "enum",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/OrientationType",
                                                        "isLeaf": true,
                                                        "label": "朝向",
                                                        "level": "entity",
                                                        "checked": true,
                                                        "enumItems": {
                                                            "EAST": "东",
                                                            "SOUTH": "南",
                                                            "WEST": "西",
                                                            "NORTH": "北"
                                                        }
                                                    },
                                                    "bed": {
                                                        "name": "bed",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "床",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "chair": {
                                                        "name": "chair",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "椅子",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "table": {
                                                        "name": "table",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "桌子",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "aircondition": {
                                                        "name": "aircondition",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "空调",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "television": {
                                                        "name": "television",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "电视",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "refrigerator": {
                                                        "name": "refrigerator",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "冰箱",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "cost": {
                                                        "name": "cost",
                                                        "description": "",
                                                        "type": "number",
                                                        "format": "double",
                                                        "isLeaf": true,
                                                        "label": "每月房租",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "deposit": {
                                                        "name": "deposit",
                                                        "description": "",
                                                        "type": "number",
                                                        "format": "double",
                                                        "isLeaf": true,
                                                        "label": "押金",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "users": {
                                                        "name": "users",
                                                        "description": "",
                                                        "type": "object",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/UserInRoom",
                                                        "isLeaf": true,
                                                        "relationship": "OneToMany",
                                                        "required": false,
                                                        "label": "已入住人员",
                                                        "level": "entity",
                                                        "checked": true,
                                                        "properties": {
                                                            "id": {
                                                                "name": "id",
                                                                "description": "主键",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "userId": {
                                                                "name": "userId",
                                                                "description": "",
                                                                "type": "string",
                                                                "format": "",
                                                                "isLeaf": true,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "applyId": {
                                                                "name": "applyId",
                                                                "description": "",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "createdTime": {
                                                                "name": "createdTime",
                                                                "description": "创建时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            },
                                                            "updatedTime": {
                                                                "name": "updatedTime",
                                                                "description": "更新时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "checked": true
                                                            }
                                                        }
                                                    },
                                                    "status": {
                                                        "name": "status",
                                                        "description": "",
                                                        "type": "enum",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/RoomStatus",
                                                        "isLeaf": true,
                                                        "label": "房间状态",
                                                        "level": "entity",
                                                        "checked": true,
                                                        "enumItems": {
                                                            "ENABLED": "开放",
                                                            "DISABLED": "关闭"
                                                        }
                                                    },
                                                    "description": {
                                                        "name": "description",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "房间介绍",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "pictures": {
                                                        "name": "pictures",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "房间图片",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "createdTime": {
                                                        "name": "createdTime",
                                                        "description": "创建时间",
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "isLeaf": true,
                                                        "editable": false,
                                                        "label": "创建时间",
                                                        "level": "property",
                                                        "checked": true
                                                    },
                                                    "updatedTime": {
                                                        "name": "updatedTime",
                                                        "description": "更新时间",
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "isLeaf": true,
                                                        "editable": false,
                                                        "label": "更新时间",
                                                        "level": "property",
                                                        "checked": true
                                                    }
                                                }
                                            },
                                            "applyContent": {
                                                "name": "applyContent",
                                                "description": "",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "createdTime": {
                                                "name": "createdTime",
                                                "label": "创建时间",
                                                "description": "创建时间",
                                                "type": "string",
                                                "format": "date-time",
                                                "isLeaf": true,
                                                "editable": false,
                                                "level": "property",
                                                "checked": true
                                            },
                                            "updatedTime": {
                                                "name": "updatedTime",
                                                "label": "更新时间",
                                                "description": "更新时间",
                                                "type": "string",
                                                "format": "date-time",
                                                "isLeaf": true,
                                                "editable": false,
                                                "level": "property",
                                                "checked": true
                                            }
                                        }
                                    },
                                    "checked": true
                                },
                                "empty": {
                                    "name": "empty",
                                    "description": "",
                                    "type": "boolean",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": ""
                                },
                                "first": {
                                    "name": "first",
                                    "description": "",
                                    "type": "boolean",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": ""
                                },
                                "last": {
                                    "name": "last",
                                    "description": "",
                                    "type": "boolean",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": ""
                                },
                                "number": {
                                    "name": "number",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": "int"
                                },
                                "numberOfElements": {
                                    "name": "numberOfElements",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": "int"
                                },
                                "size": {
                                    "name": "size",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": "int"
                                },
                                "totalElements": {
                                    "name": "totalElements",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": "int"
                                },
                                "totalPages": {
                                    "name": "totalPages",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "checked": true,
                                    "format": "int"
                                }
                            }
                        },
                        "selectedParams": [],
                        "singularResolverName": "getAllRoomApply",
                        "querySchemaList": {
                            "name": "Data",
                            "description": "",
                            "type": "object",
                            "format": "",
                            "$ref": "#/flowend925/structures/PageOfRoomApply",
                            "level": "structure",
                            "propertyList": [
                                {
                                    "name": "content",
                                    "description": "",
                                    "type": "array",
                                    "level": "entity",
                                    "isArray": true,
                                    "$ref": "#/flowend925/entities/RoomApply",
                                    "items": {
                                        "$ref": "#/flowend925/entities/RoomApply",
                                        "level": "entity",
                                        "type": "object",
                                        "propertyList": [
                                            {
                                                "name": "id",
                                                "description": "主键",
                                                "type": "integer",
                                                "format": "long",
                                                "isLeaf": true,
                                                "editable": false,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Long",
                                                "checked": true
                                            },
                                            {
                                                "name": "userId",
                                                "description": "用户 ID",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/String",
                                                "checked": true
                                            },
                                            {
                                                "name": "status",
                                                "description": "工单状态",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/String",
                                                "checked": true
                                            },
                                            {
                                                "name": "accommodationAgreement",
                                                "description": "签署协议",
                                                "type": "boolean",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Boolean",
                                                "checked": true
                                            },
                                            {
                                                "name": "deposit",
                                                "description": "押金",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Decimal",
                                                "checked": true
                                            },
                                            {
                                                "name": "cost",
                                                "description": "每月房租",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Decimal",
                                                "checked": true
                                            },
                                            {
                                                "name": "waterMode",
                                                "description": "",
                                                "type": "enum",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/BillMode",
                                                "isLeaf": true,
                                                "level": "entity",
                                                "enumItemList": [
                                                    {
                                                        "level": "enumItem",
                                                        "label": "单价收费",
                                                        "value": "USED"
                                                    },
                                                    {
                                                        "level": "enumItem",
                                                        "label": "月度收费",
                                                        "value": "MONTHLY"
                                                    }
                                                ],
                                                "checked": true
                                            },
                                            {
                                                "name": "waterPrice",
                                                "description": "",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Decimal",
                                                "checked": true
                                            },
                                            {
                                                "name": "electricityMode",
                                                "description": "",
                                                "type": "enum",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/BillMode",
                                                "isLeaf": true,
                                                "level": "entity",
                                                "enumItemList": [
                                                    {
                                                        "level": "enumItem",
                                                        "label": "单价收费",
                                                        "value": "USED"
                                                    },
                                                    {
                                                        "level": "enumItem",
                                                        "label": "月度收费",
                                                        "value": "MONTHLY"
                                                    }
                                                ],
                                                "checked": true
                                            },
                                            {
                                                "name": "electricityPrice",
                                                "description": "",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Decimal",
                                                "checked": true
                                            },
                                            {
                                                "name": "hotWaterMode",
                                                "description": "",
                                                "type": "enum",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/BillMode",
                                                "isLeaf": true,
                                                "level": "entity",
                                                "enumItemList": [
                                                    {
                                                        "level": "enumItem",
                                                        "label": "单价收费",
                                                        "value": "USED"
                                                    },
                                                    {
                                                        "level": "enumItem",
                                                        "label": "月度收费",
                                                        "value": "MONTHLY"
                                                    }
                                                ],
                                                "checked": true
                                            },
                                            {
                                                "name": "hotWaterPrice",
                                                "description": "",
                                                "type": "number",
                                                "format": "double",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/Decimal",
                                                "checked": true
                                            },
                                            {
                                                "name": "pay",
                                                "description": "支付凭证",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/String",
                                                "checked": true
                                            },
                                            {
                                                "name": "reject",
                                                "description": "",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/String",
                                                "checked": true
                                            },
                                            {
                                                "name": "rejectMark",
                                                "description": "",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/String",
                                                "checked": true
                                            },
                                            {
                                                "name": "room",
                                                "description": "",
                                                "type": "object",
                                                "format": "",
                                                "$ref": "#/flowend925/entities/Room",
                                                "isLeaf": true,
                                                "relationship": "ManyToOne",
                                                "level": "entity",
                                                "propertyList": [
                                                    {
                                                        "name": "id",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "long",
                                                        "isLeaf": true,
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Long",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "location",
                                                        "description": "",
                                                        "type": "object",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/Location",
                                                        "isLeaf": true,
                                                        "relationship": "ManyToOne",
                                                        "label": "地点",
                                                        "level": "entity",
                                                        "propertyList": [
                                                            {
                                                                "name": "id",
                                                                "description": "主键",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Long",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "name",
                                                                "description": "",
                                                                "type": "string",
                                                                "format": "",
                                                                "isLeaf": true,
                                                                "label": "地点名称",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/String",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "distribution",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/Distribution",
                                                                "isLeaf": true,
                                                                "label": "分配方式",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "自动",
                                                                        "value": "AUTO"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "手动",
                                                                        "value": "MANUAL"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "applyDocument",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/ApplyDocument",
                                                                "isLeaf": true,
                                                                "label": "申请资料",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "需要",
                                                                        "value": "YES"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "不需要",
                                                                        "value": "NO"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "applyOutDocument",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/ApplyOutDocument",
                                                                "isLeaf": true,
                                                                "label": "退宿资料",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "必填",
                                                                        "value": "YES"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "选填",
                                                                        "value": "NO"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "payMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/PayMode",
                                                                "isLeaf": true,
                                                                "label": "支付方式",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "在线支付",
                                                                        "value": "ONLINE"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "线下缴费",
                                                                        "value": "OFFLINE"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "waterMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/BillMode",
                                                                "isLeaf": true,
                                                                "label": "冷水费",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "单价收费",
                                                                        "value": "USED"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "月度收费",
                                                                        "value": "MONTHLY"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "waterPrice",
                                                                "description": "",
                                                                "type": "number",
                                                                "format": "double",
                                                                "isLeaf": true,
                                                                "label": "冷水价格",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Decimal",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "electricityMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/BillMode",
                                                                "isLeaf": true,
                                                                "label": "电费",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "单价收费",
                                                                        "value": "USED"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "月度收费",
                                                                        "value": "MONTHLY"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "electricityPrice",
                                                                "description": "",
                                                                "type": "number",
                                                                "format": "double",
                                                                "isLeaf": true,
                                                                "label": "电费价格",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Decimal",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "hotWaterMode",
                                                                "description": "",
                                                                "type": "enum",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/BillMode",
                                                                "isLeaf": true,
                                                                "label": "热水费",
                                                                "level": "entity",
                                                                "enumItemList": [
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "单价收费",
                                                                        "value": "USED"
                                                                    },
                                                                    {
                                                                        "level": "enumItem",
                                                                        "label": "月度收费",
                                                                        "value": "MONTHLY"
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "hotWaterPrice",
                                                                "description": "",
                                                                "type": "number",
                                                                "format": "double",
                                                                "isLeaf": true,
                                                                "label": "热水价格",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Decimal",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "createdTime",
                                                                "description": "创建时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "label": "创建时间",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/DateTime",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "updatedTime",
                                                                "description": "更新时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "label": "更新时间",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/DateTime",
                                                                "checked": true
                                                            }
                                                        ],
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "building",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "楼栋",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/String",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "floor",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "楼层",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/String",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "roomNo",
                                                        "description": "房间号",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "房号",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/String",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "roomType",
                                                        "description": "",
                                                        "type": "object",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/RoomType",
                                                        "isLeaf": true,
                                                        "relationship": "ManyToOne",
                                                        "label": "房间类型",
                                                        "level": "entity",
                                                        "propertyList": [
                                                            {
                                                                "name": "id",
                                                                "description": "主键",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Long",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "name",
                                                                "description": "",
                                                                "type": "string",
                                                                "format": "",
                                                                "isLeaf": true,
                                                                "label": "房间类型",
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/String",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "location",
                                                                "description": "",
                                                                "type": "object",
                                                                "format": "",
                                                                "$ref": "#/flowend925/entities/Location",
                                                                "isLeaf": true,
                                                                "relationship": "ManyToOne",
                                                                "label": "地点",
                                                                "level": "entity",
                                                                "propertyList": [
                                                                    {
                                                                        "name": "id",
                                                                        "description": "主键",
                                                                        "type": "integer",
                                                                        "format": "long",
                                                                        "isLeaf": true,
                                                                        "editable": false,
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/Long",
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "name",
                                                                        "description": "",
                                                                        "type": "string",
                                                                        "format": "",
                                                                        "isLeaf": true,
                                                                        "label": "地点名称",
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/String",
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "distribution",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/Distribution",
                                                                        "isLeaf": true,
                                                                        "label": "分配方式",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "自动",
                                                                                "value": "AUTO"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "手动",
                                                                                "value": "MANUAL"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "applyDocument",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/ApplyDocument",
                                                                        "isLeaf": true,
                                                                        "label": "申请资料",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "需要",
                                                                                "value": "YES"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "不需要",
                                                                                "value": "NO"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "applyOutDocument",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/ApplyOutDocument",
                                                                        "isLeaf": true,
                                                                        "label": "退宿资料",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "必填",
                                                                                "value": "YES"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "选填",
                                                                                "value": "NO"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "payMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/PayMode",
                                                                        "isLeaf": true,
                                                                        "label": "支付方式",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "在线支付",
                                                                                "value": "ONLINE"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "线下缴费",
                                                                                "value": "OFFLINE"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "waterMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/BillMode",
                                                                        "isLeaf": true,
                                                                        "label": "冷水费",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "单价收费",
                                                                                "value": "USED"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "月度收费",
                                                                                "value": "MONTHLY"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "waterPrice",
                                                                        "description": "",
                                                                        "type": "number",
                                                                        "format": "double",
                                                                        "isLeaf": true,
                                                                        "label": "冷水价格",
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/Decimal",
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "electricityMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/BillMode",
                                                                        "isLeaf": true,
                                                                        "label": "电费",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "单价收费",
                                                                                "value": "USED"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "月度收费",
                                                                                "value": "MONTHLY"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "electricityPrice",
                                                                        "description": "",
                                                                        "type": "number",
                                                                        "format": "double",
                                                                        "isLeaf": true,
                                                                        "label": "电费价格",
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/Decimal",
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "hotWaterMode",
                                                                        "description": "",
                                                                        "type": "enum",
                                                                        "format": "",
                                                                        "$ref": "#/flowend925/entities/BillMode",
                                                                        "isLeaf": true,
                                                                        "label": "热水费",
                                                                        "level": "entity",
                                                                        "enumItemList": [
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "单价收费",
                                                                                "value": "USED"
                                                                            },
                                                                            {
                                                                                "level": "enumItem",
                                                                                "label": "月度收费",
                                                                                "value": "MONTHLY"
                                                                            }
                                                                        ],
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "hotWaterPrice",
                                                                        "description": "",
                                                                        "type": "number",
                                                                        "format": "double",
                                                                        "isLeaf": true,
                                                                        "label": "热水价格",
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/Decimal",
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "createdTime",
                                                                        "description": "创建时间",
                                                                        "type": "string",
                                                                        "format": "date-time",
                                                                        "isLeaf": true,
                                                                        "editable": false,
                                                                        "label": "创建时间",
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/DateTime",
                                                                        "checked": true
                                                                    },
                                                                    {
                                                                        "name": "updatedTime",
                                                                        "description": "更新时间",
                                                                        "type": "string",
                                                                        "format": "date-time",
                                                                        "isLeaf": true,
                                                                        "editable": false,
                                                                        "label": "更新时间",
                                                                        "level": "property",
                                                                        "$ref": "#/basicTypes/DateTime",
                                                                        "checked": true
                                                                    }
                                                                ],
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "createdTime",
                                                                "label": "创建时间",
                                                                "description": "创建时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/DateTime",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "updatedTime",
                                                                "label": "更新时间",
                                                                "description": "更新时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/DateTime",
                                                                "checked": true
                                                            }
                                                        ],
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "genderType",
                                                        "description": "",
                                                        "type": "enum",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/RoomGenderType",
                                                        "isLeaf": true,
                                                        "label": "房间类别",
                                                        "level": "entity",
                                                        "enumItemList": [
                                                            {
                                                                "level": "enumItem",
                                                                "label": "男寝",
                                                                "value": "MALE"
                                                            },
                                                            {
                                                                "level": "enumItem",
                                                                "label": "女寝",
                                                                "value": "FEMALE"
                                                            }
                                                        ],
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "bedCount",
                                                        "description": "床位总数",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "床位总数",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "bedLeft",
                                                        "description": "床位剩余",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "床位剩余",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "orientation",
                                                        "description": "",
                                                        "type": "enum",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/OrientationType",
                                                        "isLeaf": true,
                                                        "label": "朝向",
                                                        "level": "entity",
                                                        "enumItemList": [
                                                            {
                                                                "level": "enumItem",
                                                                "label": "东",
                                                                "value": "EAST"
                                                            },
                                                            {
                                                                "level": "enumItem",
                                                                "label": "南",
                                                                "value": "SOUTH"
                                                            },
                                                            {
                                                                "level": "enumItem",
                                                                "label": "西",
                                                                "value": "WEST"
                                                            },
                                                            {
                                                                "level": "enumItem",
                                                                "label": "北",
                                                                "value": "NORTH"
                                                            }
                                                        ],
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "bed",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "床",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "chair",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "椅子",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "table",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "桌子",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "aircondition",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "空调",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "television",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "电视",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "refrigerator",
                                                        "description": "",
                                                        "type": "integer",
                                                        "format": "int",
                                                        "isLeaf": true,
                                                        "label": "冰箱",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Integer",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "cost",
                                                        "description": "",
                                                        "type": "number",
                                                        "format": "double",
                                                        "isLeaf": true,
                                                        "label": "每月房租",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Decimal",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "deposit",
                                                        "description": "",
                                                        "type": "number",
                                                        "format": "double",
                                                        "isLeaf": true,
                                                        "label": "押金",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/Decimal",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "users",
                                                        "description": "",
                                                        "type": "object",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/UserInRoom",
                                                        "isLeaf": true,
                                                        "relationship": "OneToMany",
                                                        "required": false,
                                                        "label": "已入住人员",
                                                        "level": "entity",
                                                        "propertyList": [
                                                            {
                                                                "name": "id",
                                                                "description": "主键",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Long",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "userId",
                                                                "description": "",
                                                                "type": "string",
                                                                "format": "",
                                                                "isLeaf": true,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/String",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "applyId",
                                                                "description": "",
                                                                "type": "integer",
                                                                "format": "long",
                                                                "isLeaf": true,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/Long",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "createdTime",
                                                                "description": "创建时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/DateTime",
                                                                "checked": true
                                                            },
                                                            {
                                                                "name": "updatedTime",
                                                                "description": "更新时间",
                                                                "type": "string",
                                                                "format": "date-time",
                                                                "isLeaf": true,
                                                                "editable": false,
                                                                "level": "property",
                                                                "$ref": "#/basicTypes/DateTime",
                                                                "checked": true
                                                            }
                                                        ],
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "status",
                                                        "description": "",
                                                        "type": "enum",
                                                        "format": "",
                                                        "$ref": "#/flowend925/entities/RoomStatus",
                                                        "isLeaf": true,
                                                        "label": "房间状态",
                                                        "level": "entity",
                                                        "enumItemList": [
                                                            {
                                                                "level": "enumItem",
                                                                "label": "开放",
                                                                "value": "ENABLED"
                                                            },
                                                            {
                                                                "level": "enumItem",
                                                                "label": "关闭",
                                                                "value": "DISABLED"
                                                            }
                                                        ],
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "description",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "房间介绍",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/String",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "pictures",
                                                        "description": "",
                                                        "type": "string",
                                                        "format": "",
                                                        "isLeaf": true,
                                                        "label": "房间图片",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/String",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "createdTime",
                                                        "description": "创建时间",
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "isLeaf": true,
                                                        "editable": false,
                                                        "label": "创建时间",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/DateTime",
                                                        "checked": true
                                                    },
                                                    {
                                                        "name": "updatedTime",
                                                        "description": "更新时间",
                                                        "type": "string",
                                                        "format": "date-time",
                                                        "isLeaf": true,
                                                        "editable": false,
                                                        "label": "更新时间",
                                                        "level": "property",
                                                        "$ref": "#/basicTypes/DateTime",
                                                        "checked": true
                                                    }
                                                ],
                                                "checked": true
                                            },
                                            {
                                                "name": "applyContent",
                                                "description": "",
                                                "type": "string",
                                                "format": "",
                                                "isLeaf": true,
                                                "level": "property",
                                                "$ref": "#/basicTypes/String",
                                                "checked": true
                                            },
                                            {
                                                "name": "createdTime",
                                                "label": "创建时间",
                                                "description": "创建时间",
                                                "type": "string",
                                                "format": "date-time",
                                                "isLeaf": true,
                                                "editable": false,
                                                "level": "property",
                                                "$ref": "#/basicTypes/DateTime",
                                                "checked": true
                                            },
                                            {
                                                "name": "updatedTime",
                                                "label": "更新时间",
                                                "description": "更新时间",
                                                "type": "string",
                                                "format": "date-time",
                                                "isLeaf": true,
                                                "editable": false,
                                                "level": "property",
                                                "$ref": "#/basicTypes/DateTime",
                                                "checked": true
                                            }
                                        ]
                                    },
                                    "checked": true
                                },
                                {
                                    "name": "empty",
                                    "description": "",
                                    "type": "boolean",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Boolean",
                                    "checked": true
                                },
                                {
                                    "name": "first",
                                    "description": "",
                                    "type": "boolean",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Boolean",
                                    "checked": true
                                },
                                {
                                    "name": "last",
                                    "description": "",
                                    "type": "boolean",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Boolean",
                                    "checked": true
                                },
                                {
                                    "name": "number",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Integer",
                                    "checked": true
                                },
                                {
                                    "name": "numberOfElements",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Integer",
                                    "checked": true
                                },
                                {
                                    "name": "size",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Integer",
                                    "checked": true
                                },
                                {
                                    "name": "totalElements",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Integer",
                                    "checked": true
                                },
                                {
                                    "name": "totalPages",
                                    "description": "",
                                    "type": "integer",
                                    "level": "property",
                                    "isLeaf": true,
                                    "$ref": "#/basicTypes/Integer",
                                    "checked": true
                                }
                            ],
                            "checked": true
                        },
                        "offsetX": 942.421875,
                        "offsetY": 381
                    }
                ]
            },
            "expanded": true
        },
        {
            "level": "logic",
            "name": "remove",
            "definition": {
                "params": [
                    {
                        "level": "param",
                        "name": "event",
                        "schema": {
                            "ref": "#/basicTypes/String"
                        }
                    },
                    {
                        "level": "param",
                        "name": "scope",
                        "schema": {
                            "ref": "#/basicTypes/String"
                        }
                    }
                ],
                "returns": [],
                "variables": [
                    {
                        "level": "variable",
                        "name": "res",
                        "schema": {
                            "$ref": "#/flowend925/structures/PageOfRoomApply"
                        },
                        "init": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "content"
                                    },
                                    "value": {
                                        "type": "ArrayExpression",
                                        "elements": []
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "empty"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "first"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "last"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "number"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "numberOfElements"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "size"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "totalElements"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                },
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "totalPages"
                                    },
                                    "value": {
                                        "type": "Identifier",
                                        "name": "undefined"
                                    }
                                }
                            ]
                        }
                    }
                ],
                "body": [
                    {
                        "level": "logicNode",
                        "type": "Start"
                    },
                    {
                        "level": "logicNode",
                        "type": "AssignmentExpression",
                        "operator": "=",
                        "left": {
                            "level": "logicNode",
                            "type": "Identifier",
                            "name": "res"
                        },
                        "right": {
                            "level": "logicNode",
                            "type": "CallInterface",
                            "label": "调用接口",
                            "interfaceKey": "flowend925/deleteRoomApply",
                            "params": [
                                {
                                    "name": "id",
                                    "in": "path",
                                    "value": {
                                        "level": "expressionNode",
                                        "type": "MemberExpression",
                                        "object": {
                                            "level": "expressionNode",
                                            "type": "MemberExpression",
                                            "object": {
                                                "level": "expressionNode",
                                                "type": "Identifier",
                                                "name": "scope"
                                            },
                                            "property": {
                                                "level": "expressionNode",
                                                "type": "Identifier",
                                                "name": "item"
                                            }
                                        },
                                        "property": {
                                            "level": "expressionNode",
                                            "type": "Identifier",
                                            "name": "id"
                                        }
                                    }
                                }
                            ],
                            "selectedParams": [
                                {
                                    "level": "param",
                                    "type": "Identifier",
                                    "isLeaf": true,
                                    "name": "id",
                                    "in": "path",
                                    "required": true,
                                    "schema": {
                                        "type": "integer",
                                        "format": "long",
                                        "isLeaf": true
                                    }
                                }
                            ]
                        }
                    },
                    {
                        "level": "logicNode",
                        "type": "CallLogic",
                        "label": "调用逻辑",
                        "calleeCode": "$refs['tableView'].reload",
                        "arguments": []
                    },
                    {
                        "level": "logicNode",
                        "type": "End"
                    }
                ]
            },
            "expanded": true
        },
        {
            "level": "logic",
            "expanded": true,
            "name": "openAccept",
            "description": "",
            "definition": {
                "params": [
                    {
                        "level": "param",
                        "type": "Identifier",
                        "name": "event",
                        "description": "",
                        "schema": {
                            "type": "string",
                            "format": ""
                        },
                        "required": true,
                        "isLeaf": true,
                        "existingNames": [
                            "abstract",
                            "in",
                            "double",
                            "arguments",
                            "boolean",
                            "break",
                            "byte",
                            "case",
                            "catch",
                            "char",
                            "class*",
                            "const",
                            "continue",
                            "debugger",
                            "default",
                            "delete",
                            "do",
                            "else",
                            "enum*",
                            "eval",
                            "export*",
                            "extends*",
                            false,
                            "final",
                            "finally",
                            "float",
                            "for",
                            "function",
                            "goto",
                            "if",
                            "implements",
                            "import*",
                            "instanceof",
                            "int",
                            "interface",
                            "let",
                            "long",
                            "native",
                            "new",
                            null,
                            "package",
                            "private",
                            "protected",
                            "public",
                            "return",
                            "short",
                            "static",
                            "super*",
                            "switch",
                            "synchronized",
                            "this",
                            "throw",
                            "throws",
                            "transient",
                            true,
                            "try",
                            "typeof",
                            "var",
                            "void",
                            "volatile",
                            "while",
                            "with",
                            "yield",
                            "roomApplyItem",
                            "load",
                            "remove",
                            "openAccept",
                            "accept"
                        ],
                        "init": {
                            "type": "StringLiteral",
                            "value": ""
                        }
                    },
                    {
                        "level": "param",
                        "type": "Identifier",
                        "name": "scope",
                        "description": "",
                        "schema": {
                            "$ref": "#/flowfront0928/structures/ScopeOfProcessTask"
                        },
                        "required": true,
                        "isLeaf": true,
                        "existingNames": [
                            "abstract",
                            "in",
                            "double",
                            "arguments",
                            "boolean",
                            "break",
                            "byte",
                            "case",
                            "catch",
                            "char",
                            "class*",
                            "const",
                            "continue",
                            "debugger",
                            "default",
                            "delete",
                            "do",
                            "else",
                            "enum*",
                            "eval",
                            "export*",
                            "extends*",
                            false,
                            "final",
                            "finally",
                            "float",
                            "for",
                            "function",
                            "goto",
                            "if",
                            "implements",
                            "import*",
                            "instanceof",
                            "int",
                            "interface",
                            "let",
                            "long",
                            "native",
                            "new",
                            null,
                            "package",
                            "private",
                            "protected",
                            "public",
                            "return",
                            "short",
                            "static",
                            "super*",
                            "switch",
                            "synchronized",
                            "this",
                            "throw",
                            "throws",
                            "transient",
                            true,
                            "try",
                            "typeof",
                            "var",
                            "void",
                            "volatile",
                            "while",
                            "with",
                            "yield",
                            "roomApplyItem",
                            "load",
                            "remove",
                            "openAccept",
                            "accept"
                        ],
                        "init": {
                            "type": "ObjectExpression",
                            "properties": [
                                {
                                    "type": "ObjectProperty",
                                    "key": {
                                        "type": "Identifier",
                                        "name": "item"
                                    },
                                    "value": {
                                        "type": "ObjectExpression",
                                        "properties": [
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "id"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "processDefinitionId"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "taskDefinitionKey"
                                                },
                                                "value": {
                                                    "type": "Identifier",
                                                    "name": "undefined"
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "variables"
                                                },
                                                "value": {
                                                    "type": "ObjectExpression",
                                                    "properties": [
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "id"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "userId"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "status"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "accommodationAgreement"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "deposit"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "cost"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "waterMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "USED"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "waterPrice"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "electricityMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "USED"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "electricityPrice"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "hotWaterMode"
                                                            },
                                                            "value": {
                                                                "type": "StringLiteral",
                                                                "value": "USED"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "hotWaterPrice"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "pay"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "reject"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "rejectMark"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "room"
                                                            },
                                                            "value": {
                                                                "type": "ObjectExpression",
                                                                "properties": [
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "id"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "location"
                                                                        },
                                                                        "value": {
                                                                            "type": "ObjectExpression",
                                                                            "properties": [
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "id"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "name"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "distribution"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "AUTO"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "applyDocument"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "YES"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "applyOutDocument"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "YES"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "payMode"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "ONLINE"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "waterMode"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "USED"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "waterPrice"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "electricityMode"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "USED"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "electricityPrice"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "hotWaterMode"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "StringLiteral",
                                                                                        "value": "USED"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "hotWaterPrice"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "createdTime"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "updatedTime"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "building"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "floor"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "roomNo"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "roomType"
                                                                        },
                                                                        "value": {
                                                                            "type": "ObjectExpression",
                                                                            "properties": [
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "id"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "name"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "location"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "ObjectExpression",
                                                                                        "properties": [
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "id"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "name"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "distribution"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "AUTO"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "applyDocument"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "YES"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "applyOutDocument"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "YES"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "payMode"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "ONLINE"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "waterMode"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "USED"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "waterPrice"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "electricityMode"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "USED"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "electricityPrice"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "hotWaterMode"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "StringLiteral",
                                                                                                    "value": "USED"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "hotWaterPrice"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "createdTime"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                "type": "ObjectProperty",
                                                                                                "key": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "updatedTime"
                                                                                                },
                                                                                                "value": {
                                                                                                    "type": "Identifier",
                                                                                                    "name": "undefined"
                                                                                                }
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "createdTime"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "updatedTime"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "genderType"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "MALE"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "bedCount"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "bedLeft"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "orientation"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "EAST"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "bed"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "chair"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "table"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "aircondition"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "television"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "refrigerator"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "cost"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "deposit"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "users"
                                                                        },
                                                                        "value": {
                                                                            "type": "ObjectExpression",
                                                                            "properties": [
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "id"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "userId"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "applyId"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "createdTime"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "updatedTime"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                },
                                                                                {
                                                                                    "type": "ObjectProperty",
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "room"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "Identifier",
                                                                                        "name": "undefined"
                                                                                    }
                                                                                }
                                                                            ]
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "status"
                                                                        },
                                                                        "value": {
                                                                            "type": "StringLiteral",
                                                                            "value": "ENABLED"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "description"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "pictures"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "createdTime"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "updatedTime"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "applyContent"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "createdTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "updatedTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        }
                                                    ]
                                                }
                                            },
                                            {
                                                "type": "ObjectProperty",
                                                "key": {
                                                    "type": "Identifier",
                                                    "name": "userInfo"
                                                },
                                                "value": {
                                                    "type": "ObjectExpression",
                                                    "properties": [
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "Status"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "LastLoginTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "UserInfoExtend"
                                                            },
                                                            "value": {
                                                                "type": "ObjectExpression",
                                                                "properties": [
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "工号"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    },
                                                                    {
                                                                        "type": "ObjectProperty",
                                                                        "key": {
                                                                            "type": "Identifier",
                                                                            "name": "身份证"
                                                                        },
                                                                        "value": {
                                                                            "type": "Identifier",
                                                                            "name": "undefined"
                                                                        }
                                                                    }
                                                                ]
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "UserName"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "UserId"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "CreateTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "UpdateTime"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "LoginCount"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "Source"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "Email"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        },
                                                        {
                                                            "type": "ObjectProperty",
                                                            "key": {
                                                                "type": "Identifier",
                                                                "name": "Phone"
                                                            },
                                                            "value": {
                                                                "type": "Identifier",
                                                                "name": "undefined"
                                                            }
                                                        }
                                                    ]
                                                }
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                "returns": [],
                "variables": [],
                "body": [
                    {
                        "level": "logicNode",
                        "type": "Start",
                        "label": "开始"
                    },
                    {
                        "level": "logicNode",
                        "type": "AssignmentExpression",
                        "label": "赋值",
                        "operator": "=",
                        "left": {
                            "level": "expressionNode",
                            "type": "Identifier",
                            "name": "roomApplyItem",
                            "index": 1602769417847
                        },
                        "right": {
                            "level": "expressionNode",
                            "type": "MemberExpression",
                            "name": "name",
                            "hide": false,
                            "index": 1602769417940,
                            "object": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "scope",
                                "index": 1602769417940
                            },
                            "property": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "item"
                            },
                            "offsetX": 638.09375,
                            "offsetY": 466
                        }
                    },
                    {
                        "level": "logicNode",
                        "type": "CallLogic",
                        "label": "调用逻辑",
                        "calleeCode": "$refs['modal1'].open",
                        "arguments": []
                    },
                    {
                        "level": "logicNode",
                        "type": "End",
                        "label": "结束"
                    }
                ],
                "playground": [
                    {
                        "level": "expressionNode",
                        "type": "BuiltInFunction",
                        "value": "Clone",
                        "offsetX": 853.09375,
                        "offsetY": 241,
                        "calleeCode": "Clone",
                        "params": [
                            {
                                "name": "obj",
                                "schema": {
                                    "type": "object",
                                    "properties": {}
                                },
                                "value": null
                            }
                        ]
                    }
                ]
            },
            "serviceType": "web",
            "existingNames": [
                "abstract",
                "in",
                "double",
                "arguments",
                "boolean",
                "break",
                "byte",
                "case",
                "catch",
                "char",
                "class*",
                "const",
                "continue",
                "debugger",
                "default",
                "delete",
                "do",
                "else",
                "enum*",
                "eval",
                "export*",
                "extends*",
                false,
                "final",
                "finally",
                "float",
                "for",
                "function",
                "goto",
                "if",
                "implements",
                "import*",
                "instanceof",
                "int",
                "interface",
                "let",
                "long",
                "native",
                "new",
                null,
                "package",
                "private",
                "protected",
                "public",
                "return",
                "short",
                "static",
                "super*",
                "switch",
                "synchronized",
                "this",
                "throw",
                "throws",
                "transient",
                true,
                "try",
                "typeof",
                "var",
                "void",
                "volatile",
                "while",
                "with",
                "yield",
                "load",
                "remove"
            ]
        },
        {
            "level": "logic",
            "expanded": true,
            "name": "accept",
            "description": "",
            "definition": {
                "params": [],
                "returns": [],
                "variables": [],
                "body": [
                    {
                        "level": "logicNode",
                        "type": "Start",
                        "label": "开始"
                    },
                    {
                        "level": "logicNode",
                        "type": "AssignmentExpression",
                        "label": "赋值",
                        "operator": "=",
                        "left": {
                            "level": "expressionNode",
                            "type": "MemberExpression",
                            "name": "",
                            "index": 1602769144982,
                            "object": {
                                "level": "expressionNode",
                                "type": "MemberExpression",
                                "object": {
                                    "level": "expressionNode",
                                    "type": "Identifier",
                                    "name": "roomApplyItem",
                                    "index": 1602769144982
                                },
                                "property": {
                                    "level": "expressionNode",
                                    "type": "Identifier",
                                    "name": "variables"
                                },
                                "index": 1602769144982
                            },
                            "property": {
                                "level": "expressionNode",
                                "type": "Identifier",
                                "name": "status"
                            }
                        },
                        "right": {
                            "level": "expressionNode",
                            "type": "StringLiteral",
                            "value": "完成审核"
                        }
                    },
                    {
                        "level": "logicNode",
                        "type": "CallInterface",
                        "label": "调用接口",
                        "interfaceKey": "flowend925/applyRoomTaskDone",
                        "params": [
                            {
                                "name": "taskId",
                                "in": "query",
                                "value": {
                                    "level": "expressionNode",
                                    "type": "MemberExpression",
                                    "name": "name",
                                    "hide": false,
                                    "index": 1602769145698,
                                    "offsetX": 527,
                                    "offsetY": 276,
                                    "object": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "roomApplyItem",
                                        "index": 1602769145698
                                    },
                                    "property": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "id"
                                    }
                                },
                                "schema": {
                                    "type": "string",
                                    "format": "",
                                    "isLeaf": true
                                }
                            },
                            {
                                "name": "body",
                                "in": "body",
                                "value": {
                                    "level": "expressionNode",
                                    "type": "MemberExpression",
                                    "name": "undefined",
                                    "hide": false,
                                    "index": 1602769145800,
                                    "offsetX": 365,
                                    "offsetY": 324,
                                    "object": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "roomApplyItem",
                                        "index": 1602769145800
                                    },
                                    "property": {
                                        "level": "expressionNode",
                                        "type": "Identifier",
                                        "name": "variables"
                                    }
                                },
                                "schema": {
                                    "$ref": "#/flowend925/entities/RoomApply"
                                }
                            }
                        ],
                        "selectedParams": [
                            {
                                "level": "param",
                                "type": "Identifier",
                                "name": "taskId",
                                "description": "",
                                "schema": {
                                    "type": "string",
                                    "format": "",
                                    "isLeaf": true
                                },
                                "in": "query",
                                "required": true,
                                "isLeaf": true,
                                "init": {
                                    "type": "StringLiteral",
                                    "value": ""
                                }
                            },
                            {
                                "level": "param",
                                "type": "Identifier",
                                "name": "body",
                                "description": "",
                                "schema": {
                                    "$ref": "#/flowend925/entities/RoomApply"
                                },
                                "in": "body",
                                "required": true,
                                "isLeaf": true,
                                "init": {
                                    "type": "StringLiteral",
                                    "value": ""
                                }
                            }
                        ]
                    },
                    {
                        "level": "logicNode",
                        "type": "CallLogic",
                        "label": "调用逻辑",
                        "calleeCode": "$refs['modal1'].ok",
                        "arguments": []
                    },
                    {
                        "level": "logicNode",
                        "type": "End",
                        "label": "结束"
                    }
                ],
                "playground": []
            },
            "serviceType": "web",
            "existingNames": [
                "abstract",
                "in",
                "double",
                "arguments",
                "boolean",
                "break",
                "byte",
                "case",
                "catch",
                "char",
                "class*",
                "const",
                "continue",
                "debugger",
                "default",
                "delete",
                "do",
                "else",
                "enum*",
                "eval",
                "export*",
                "extends*",
                false,
                "final",
                "finally",
                "float",
                "for",
                "function",
                "goto",
                "if",
                "implements",
                "import*",
                "instanceof",
                "int",
                "interface",
                "let",
                "long",
                "native",
                "new",
                null,
                "package",
                "private",
                "protected",
                "public",
                "return",
                "short",
                "static",
                "super*",
                "switch",
                "synchronized",
                "this",
                "throw",
                "throws",
                "transient",
                true,
                "try",
                "typeof",
                "var",
                "void",
                "volatile",
                "while",
                "with",
                "yield",
                "item",
                "load",
                "remove",
                "openAccept"
            ]
        }
    ],
    "title": "住宿申请",
    "crumb": "住宿申请"
}
</definition>
