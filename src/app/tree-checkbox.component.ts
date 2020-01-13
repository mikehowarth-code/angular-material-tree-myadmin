import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {AfterViewInit, Component, Injectable, OnInit} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
  cont: string;
  cust: string;
  debt: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
  cont: string;
  cust: string;
  debt: string;
}

/**
 * The Json object for the access control tree data.
 */
const TREE_DATA = {
  'Gas': {
    'o': {
      'cust1Id': {
        'o': {
          'debtor1Id': {
            'o': {
              'Connection1Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor1Id',
                'leaf': true
              },
              'Connection2Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor1Id',
                'leaf': true
              }
            }
          },
          'debtor2Id': {
            'o': {
              'Connection3Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor2Id',
                'leaf': true
              },
              'Connection4Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor2Id',
                'leaf': true
              }
            }
          },
          'debtor3Id': {
            'o': {
              'Connection5Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor3Id',
                'leaf': true
              },
              'Connection6Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor3Id',
                'leaf': true
              }
            }
          },
          'debtor4Id': {
            'o': {
              'Connection7Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor4Id',
                'leaf': true
              },
              'Connection8Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor4Id',
                'leaf': true
              }
            }
          },
          'debtor5Id': {
            'o': {
              'Connection9Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor5Id',
                'leaf': true
              },
              'Connection10Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor5Id',
                'leaf': true
              }
            }
          },
          'debtor6Id': {
            'o': {
              'Connection11Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor6Id',
                'leaf': true
              },
              'Connection12Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor6Id',
                'leaf': true
              }
            }
          },
          'debtor7Id': {
            'o': {
              'Connection13Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor7Id',
                'leaf': true
              },
              'Connection14Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor7Id',
                'leaf': true
              }
            }
          },
          'debtor8Id': {
            'o': {
              'Connection15Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor8Id',
                'leaf': true
              },
              'Connection16Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor8Id',
                'leaf': true
              }
            }
          },
          'debtor9Id': {
            'o': {
              'Connection17Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor9Id',
                'leaf': true
              },
              'Connection18Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor9Id',
                'leaf': true
              }
            }
          },
          'debtor10Id': {
            'o': {
              'Connection19Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor10Id',
                'leaf': true
              },
              'Connection20Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor10Id',
                'leaf': true
              }
            }
          },
          'debtor11Id': {
            'o': {
              'Connection21Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor11Id',
                'leaf': true
              },
              'Connection22Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor11Id',
                'leaf': true
              }
            }
          },
          'debtor12Id': {
            'o': {
              'Connection23Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor12Id',
                'leaf': true
              },
              'Connection24Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor12Id',
                'leaf': true
              }
            }
          },
          'debtor13Id': {
            'o': {
              'Connection25Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor13Id',
                'leaf': true
              },
              'Connection26Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor13Id',
                'leaf': true
              }
            }
          },
          'debtor14Id': {
            'o': {
              'Connection27Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor14Id',
                'leaf': true
              },
              'Connection28Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor14Id',
                'leaf': true
              }
            }
          },
          'debtor15Id': {
            'o': {
              'Connection29Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor15Id',
                'leaf': true
              },
              'Connection30Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor15Id',
                'leaf': true
              }
            }
          },
          'debtor16Id': {
            'o': {
              'Connection31Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor16Id',
                'leaf': true
              },
              'Connection32Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor16Id',
                'leaf': true
              }
            }
          },
          'debtor17Id': {
            'o': {
              'Connection33Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor17Id',
                'leaf': true
              },
              'Connection34Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor17Id',
                'leaf': true
              }
            }
          },
          'debtor18Id': {
            'o': {
              'Connection35Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor18Id',
                'leaf': true
              },
              'Connection36Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor18Id',
                'leaf': true
              }
            }
          },
          'debtor19Id': {
            'o': {
              'Connection37Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor19Id',
                'leaf': true
              },
              'Connection38Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor19Id',
                'leaf': true
              }
            }
          },
          'debtor20Id': {
            'o': {
              'Connection39Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor20Id',
                'leaf': true
              },
              'Connection40Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor20Id',
                'leaf': true
              }
            }
          },
          'debtor21Id': {
            'o': {
              'Connection41Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor21Id',
                'leaf': true
              },
              'Connection42Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor21Id',
                'leaf': true
              }
            }
          },
          'debtor25Id': {
            'o': {
              'Connection49Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor25Id',
                'leaf': true
              },
              'Connection50Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor25Id',
                'leaf': true
              }
            }
          },
          'debtor26Id': {
            'o': {
              'Connection51Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor26Id',
                'leaf': true
              },
              'Connection52Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor26Id',
                'leaf': true
              }
            }
          },
          'debtor27Id': {
            'o': {
              'Connection53Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor27Id',
                'leaf': true
              },
              'Connection54Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor27Id',
                'leaf': true
              }
            }
          }
        }
      },
      'cust2Id': {
        'o': {
          'debtor1Id': {
            'o': {
              'Connection1Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor1Id',
                'leaf': true
              },
              'Connection2Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor1Id',
                'leaf': true
              }
            }
          },
          'debtor2Id': {
            'o': {
              'Connection3Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor2Id',
                'leaf': true
              },
              'Connection4Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor2Id',
                'leaf': true
              }
            }
          },
          'debtor3Id': {
            'o': {
              'Connection5Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor3Id',
                'leaf': true
              },
              'Connection6Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor3Id',
                'leaf': true
              }
            }
          },
          'debtor4Id': {
            'o': {
              'Connection7Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor4Id',
                'leaf': true
              },
              'Connection8Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor4Id',
                'leaf': true
              }
            }
          },
          'debtor5Id': {
            'o': {
              'Connection9Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor5Id',
                'leaf': true
              },
              'Connection10Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor5Id',
                'leaf': true
              }
            }
          },
          'debtor6Id': {
            'o': {
              'Connection11Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor6Id',
                'leaf': true
              },
              'Connection12Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor6Id',
                'leaf': true
              }
            }
          },
          'debtor7Id': {
            'o': {
              'Connection13Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor7Id',
                'leaf': true
              },
              'Connection14Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor7Id',
                'leaf': true
              }
            }
          },
          'debtor8Id': {
            'o': {
              'Connection15Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor8Id',
                'leaf': true
              },
              'Connection16Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor8Id',
                'leaf': true
              }
            }
          },
          'debtor9Id': {
            'o': {
              'Connection17Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor9Id',
                'leaf': true
              },
              'Connection18Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor9Id',
                'leaf': true
              }
            }
          },
          'debtor10Id': {
            'o': {
              'Connection19Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor10Id',
                'leaf': true
              },
              'Connection20Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor10Id',
                'leaf': true
              }
            }
          },
          'debtor11Id': {
            'o': {
              'Connection21Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor11Id',
                'leaf': true
              },
              'Connection22Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor11Id',
                'leaf': true
              }
            }
          },
          'debtor12Id': {
            'o': {
              'Connection23Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor12Id',
                'leaf': true
              },
              'Connection24Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor12Id',
                'leaf': true
              }
            }
          },
          'debtor13Id': {
            'o': {
              'Connection25Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor13Id',
                'leaf': true
              },
              'Connection26Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor13Id',
                'leaf': true
              }
            }
          },
          'debtor14Id': {
            'o': {
              'Connection27Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor14Id',
                'leaf': true
              },
              'Connection28Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor14Id',
                'leaf': true
              }
            }
          },
          'debtor15Id': {
            'o': {
              'Connection29Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor15Id',
                'leaf': true
              },
              'Connection30Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor15Id',
                'leaf': true
              }
            }
          },
          'debtor16Id': {
            'o': {
              'Connection31Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor16Id',
                'leaf': true
              },
              'Connection32Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor16Id',
                'leaf': true
              }
            }
          },
          'debtor17Id': {
            'o': {
              'Connection33Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor17Id',
                'leaf': true
              },
              'Connection34Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor17Id',
                'leaf': true
              }
            }
          },
          'debtor18Id': {
            'o': {
              'Connection35Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor18Id',
                'leaf': true
              },
              'Connection36Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor18Id',
                'leaf': true
              }
            }
          },
          'debtor19Id': {
            'o': {
              'Connection37Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor19Id',
                'leaf': true
              },
              'Connection38Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor19Id',
                'leaf': true
              }
            }
          },
          'debtor20Id': {
            'o': {
              'Connection39Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor20Id',
                'leaf': true
              },
              'Connection40Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor20Id',
                'leaf': true
              }
            }
          },
          'debtor21Id': {
            'o': {
              'Connection41Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor21Id',
                'leaf': true
              },
              'Connection42Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor21Id',
                'leaf': true
              }
            }
          },
          'debtor25Id': {
            'o': {
              'Connection49Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor25Id',
                'leaf': true
              },
              'Connection50Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor25Id',
                'leaf': true
              }
            }
          },
          'debtor26Id': {
            'o': {
              'Connection51Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor26Id',
                'leaf': true
              },
              'Connection52Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor26Id',
                'leaf': true
              }
            }
          },
          'debtor27Id': {
            'o': {
              'Connection53Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor27Id',
                'leaf': true
              },
              'Connection54Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor27Id',
                'leaf': true
              }
            }
          }
        }
      },
      'cust3Id': {
        'o': {
          'debtor1Id': {
            'o': {
              'Connection1Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor1Id',
                'leaf': true
              },
              'Connection2Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor1Id',
                'leaf': true
              }
            }
          },
          'debtor2Id': {
            'o': {
              'Connection3Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor2Id',
                'leaf': true
              },
              'Connection4Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor2Id',
                'leaf': true
              }
            }
          },
          'debtor3Id': {
            'o': {
              'Connection5Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor3Id',
                'leaf': true
              },
              'Connection6Id': {
                'cont': 'contract1Id',
                'cust': 'cust1Id',
                'debt': 'debtor3Id',
                'leaf': true
              }
            }
          },
          'debtor4Id': {
            'o': {
              'Connection7Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor4Id',
                'leaf': true
              },
              'Connection8Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor4Id',
                'leaf': true
              }
            }
          },
          'debtor5Id': {
            'o': {
              'Connection9Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor5Id',
                'leaf': true
              },
              'Connection10Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor5Id',
                'leaf': true
              }
            }
          },
          'debtor6Id': {
            'o': {
              'Connection11Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor6Id',
                'leaf': true
              },
              'Connection12Id': {
                'cont': 'contract2Id',
                'cust': 'cust1Id',
                'debt': 'debtor6Id',
                'leaf': true
              }
            }
          },
          'debtor7Id': {
            'o': {
              'Connection13Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor7Id',
                'leaf': true
              },
              'Connection14Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor7Id',
                'leaf': true
              }
            }
          },
          'debtor8Id': {
            'o': {
              'Connection15Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor8Id',
                'leaf': true
              },
              'Connection16Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor8Id',
                'leaf': true
              }
            }
          },
          'debtor9Id': {
            'o': {
              'Connection17Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor9Id',
                'leaf': true
              },
              'Connection18Id': {
                'cont': 'contract3Id',
                'cust': 'cust1Id',
                'debt': 'debtor9Id',
                'leaf': true
              }
            }
          },
          'debtor10Id': {
            'o': {
              'Connection19Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor10Id',
                'leaf': true
              },
              'Connection20Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor10Id',
                'leaf': true
              }
            }
          },
          'debtor11Id': {
            'o': {
              'Connection21Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor11Id',
                'leaf': true
              },
              'Connection22Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor11Id',
                'leaf': true
              }
            }
          },
          'debtor12Id': {
            'o': {
              'Connection23Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor12Id',
                'leaf': true
              },
              'Connection24Id': {
                'cont': 'contract4Id',
                'cust': 'cust2Id',
                'debt': 'debtor12Id',
                'leaf': true
              }
            }
          },
          'debtor13Id': {
            'o': {
              'Connection25Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor13Id',
                'leaf': true
              },
              'Connection26Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor13Id',
                'leaf': true
              }
            }
          },
          'debtor14Id': {
            'o': {
              'Connection27Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor14Id',
                'leaf': true
              },
              'Connection28Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor14Id',
                'leaf': true
              }
            }
          },
          'debtor15Id': {
            'o': {
              'Connection29Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor15Id',
                'leaf': true
              },
              'Connection30Id': {
                'cont': 'contract5Id',
                'cust': 'cust2Id',
                'debt': 'debtor15Id',
                'leaf': true
              }
            }
          },
          'debtor16Id': {
            'o': {
              'Connection31Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor16Id',
                'leaf': true
              },
              'Connection32Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor16Id',
                'leaf': true
              }
            }
          },
          'debtor17Id': {
            'o': {
              'Connection33Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor17Id',
                'leaf': true
              },
              'Connection34Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor17Id',
                'leaf': true
              }
            }
          },
          'debtor18Id': {
            'o': {
              'Connection35Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor18Id',
                'leaf': true
              },
              'Connection36Id': {
                'cont': 'contract6Id',
                'cust': 'cust2Id',
                'debt': 'debtor18Id',
                'leaf': true
              }
            }
          },
          'debtor19Id': {
            'o': {
              'Connection37Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor19Id',
                'leaf': true
              },
              'Connection38Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor19Id',
                'leaf': true
              }
            }
          },
          'debtor20Id': {
            'o': {
              'Connection39Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor20Id',
                'leaf': true
              },
              'Connection40Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor20Id',
                'leaf': true
              }
            }
          },
          'debtor21Id': {
            'o': {
              'Connection41Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor21Id',
                'leaf': true
              },
              'Connection42Id': {
                'cont': 'contract7Id',
                'cust': 'cust3Id',
                'debt': 'debtor21Id',
                'leaf': true
              }
            }
          },
          'debtor25Id': {
            'o': {
              'Connection49Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor25Id',
                'leaf': true
              },
              'Connection50Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor25Id',
                'leaf': true
              }
            }
          },
          'debtor26Id': {
            'o': {
              'Connection51Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor26Id',
                'leaf': true
              },
              'Connection52Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor26Id',
                'leaf': true
              }
            }
          },
          'debtor27Id': {
            'o': {
              'Connection53Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor27Id',
                'leaf': true
              },
              'Connection54Id': {
                'cont': 'contract9Id',
                'cust': 'cust3Id',
                'debt': 'debtor27Id',
                'leaf': true
              }
            }
          }
        }
      }
    }
  },
  'Electricity': {
    'o': {
      'cust3Id': {
        'o': {
          'debtor22Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor22Id',
            'leaf': true
          },
          'debtor23Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor23Id',
            'leaf': true
          },
          'debtor24Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor24Id',
            'leaf': true
          },
          'debtor28Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor28Id',
            'leaf': true
          },
          'debtor29Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor29Id',
            'leaf': true
          },
          'debtor30Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor30Id',
            'leaf': true
          },
          'debtor31Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor31Id',
            'leaf': true
          },
          'debtor32Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor32Id',
            'leaf': true
          },
          'debtor33Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor33Id',
            'leaf': true
          },
          'debtor34Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor34Id',
            'leaf': true
          },
          'debtor35Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor35Id',
            'leaf': true
          },
          'debtor36Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor36Id',
            'leaf': true
          },
          'debtor37Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor37Id',
            'leaf': true
          },
          'debtor38Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor38Id',
            'leaf': true
          },
          'debtor39Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor39Id',
            'leaf': true
          },
          'debtor40Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor40Id',
            'leaf': true
          },
          'debtor41Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor41Id',
            'leaf': true
          },
          'debtor42Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor42Id',
            'leaf': true
          },
          'debtor43Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor43Id',
            'leaf': true
          },
          'debtor44Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor44Id',
            'leaf': true
          },
          'debtor45Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor45Id',
            'leaf': true
          }
        }
      },
      'cust4Id': {
        'o': {
          'debtor22Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor22Id',
            'leaf': true
          },
          'debtor23Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor23Id',
            'leaf': true
          },
          'debtor24Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor24Id',
            'leaf': true
          },
          'debtor28Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor28Id',
            'leaf': true
          },
          'debtor29Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor29Id',
            'leaf': true
          },
          'debtor30Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor30Id',
            'leaf': true
          },
          'debtor31Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor31Id',
            'leaf': true
          },
          'debtor32Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor32Id',
            'leaf': true
          },
          'debtor33Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor33Id',
            'leaf': true
          },
          'debtor34Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor34Id',
            'leaf': true
          },
          'debtor35Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor35Id',
            'leaf': true
          },
          'debtor36Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor36Id',
            'leaf': true
          },
          'debtor37Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor37Id',
            'leaf': true
          },
          'debtor38Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor38Id',
            'leaf': true
          },
          'debtor39Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor39Id',
            'leaf': true
          },
          'debtor40Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor40Id',
            'leaf': true
          },
          'debtor41Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor41Id',
            'leaf': true
          },
          'debtor42Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor42Id',
            'leaf': true
          },
          'debtor43Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor43Id',
            'leaf': true
          },
          'debtor44Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor44Id',
            'leaf': true
          },
          'debtor45Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor45Id',
            'leaf': true
          }
        }
      },
      'cust5Id': {
        'o': {
          'debtor22Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor22Id',
            'leaf': true
          },
          'debtor23Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor23Id',
            'leaf': true
          },
          'debtor24Id': {
            'cont': 'contract8Id',
            'cust': 'cust3Id',
            'debt': 'debtor24Id',
            'leaf': true
          },
          'debtor28Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor28Id',
            'leaf': true
          },
          'debtor29Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor29Id',
            'leaf': true
          },
          'debtor30Id': {
            'cont': 'contract10Id',
            'cust': 'cust4Id',
            'debt': 'debtor30Id',
            'leaf': true
          },
          'debtor31Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor31Id',
            'leaf': true
          },
          'debtor32Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor32Id',
            'leaf': true
          },
          'debtor33Id': {
            'cont': 'contract11Id',
            'cust': 'cust4Id',
            'debt': 'debtor33Id',
            'leaf': true
          },
          'debtor34Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor34Id',
            'leaf': true
          },
          'debtor35Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor35Id',
            'leaf': true
          },
          'debtor36Id': {
            'cont': 'contract12Id',
            'cust': 'cust4Id',
            'debt': 'debtor36Id',
            'leaf': true
          },
          'debtor37Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor37Id',
            'leaf': true
          },
          'debtor38Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor38Id',
            'leaf': true
          },
          'debtor39Id': {
            'cont': 'contract13Id',
            'cust': 'cust5Id',
            'debt': 'debtor39Id',
            'leaf': true
          },
          'debtor40Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor40Id',
            'leaf': true
          },
          'debtor41Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor41Id',
            'leaf': true
          },
          'debtor42Id': {
            'cont': 'contract14Id',
            'cust': 'cust5Id',
            'debt': 'debtor42Id',
            'leaf': true
          },
          'debtor43Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor43Id',
            'leaf': true
          },
          'debtor44Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor44Id',
            'leaf': true
          },
          'debtor45Id': {
            'cont': 'contract15Id',
            'cust': 'cust5Id',
            'debt': 'debtor45Id',
            'leaf': true
          }
        }
      }
    }
  }
};
const TREE_DATA2 = {
  'Gas': {
    'o': {
      'Customer Name 1': {
        'o': {
          'Debtor Name 1': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
          'Debtor Name 2': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
          'Debtor Name 3': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
        }
      }
    }
  },
  'Electricity': {
    'o': {
      'Customer Name 1': {
        'o': {
          'Debtor Name 1': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
        }
      }
    }
  },
  'Water': {
    'o': {
      'Customer Name 1': {
        'o': {
            'Debtor Name 1': {
              'o': {
                'Connection 1': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
                'Connection 2': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
                'Connection 3': {'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
              }
            }
        }
      }
    }
  }
};

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    const data = this.buildFileTree(TREE_DATA, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          if (value['leaf'] === undefined || value['leaf'] === false) {
            node.children = this.buildFileTree(value['o'], level + 1);
          } else {
            node.cust = value.cust;
            node.cont = value.cont;
            node.debt = value.debt;
          }
        }
      }

      return accumulator.concat(node);
    }, []);
  }

}

/**
 * @title Tree with checkboxes
 */
@Component({
  selector: 'tree-checkbox',
  templateUrl: 'tree-checkbox.component.html',
  styleUrls: ['tree-checkbox.component.css'],
  providers: [ChecklistDatabase]
})

export class TreeCheckboxComponent implements OnInit {
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  constructor(private _database: ChecklistDatabase) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    _database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit() {
    for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
      if (this.treeControl.dataNodes[i].item.startsWith('Connection 2')) {
       this.todoItemSelectionToggle(this.treeControl.dataNodes[i]);
        this.treeControl.expand(this.treeControl.dataNodes[i]);
      }
      if (this.treeControl.dataNodes[i].item === 'Gas') {
        this.treeControl.expand(this.treeControl.dataNodes[i]);
      }
    }
  }
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

  hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

  /**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
        ? existingNode
        : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.cust = node.cust;
    flatNode.cont = node.cont;
    flatNode.debt = node.debt;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
//    console.log('this.checklistSelection' + this.checklistSelection.isEmpty());
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
    this.logSelectedLeafNodes();
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    this.logSelectedLeafNodes();
  }

  logSelectedLeafNodes(): void {
    console.log('todoLeafItemSelectionToggle ' + this.checklistSelection.selected.length);
    for (let i = 0; i < this.checklistSelection.selected.length; i++) {
      if (this.checklistSelection.selected[i].expandable === undefined ||  this.checklistSelection.selected[i].expandable === false) {
        // console.log('selection ' + i + ' ' + this.checklistSelection.selected[i].item);
        // console.log('    ' + this.checklistSelection.selected[i].cont);
        // console.log('    ' + this.checklistSelection.selected[i].cust);
        // console.log('    ' + this.checklistSelection.selected[i].debt);
        console.log('           ' + this.buildPath(this.checklistSelection.selected[i]));
      }
    }
  }

  buildPath(node: TodoItemFlatNode): string {
    const segments: string[] = [];
    segments.push(node.cont); // the contract id is not in the tree so we store it at the end of the path
    segments.unshift(node.item);
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      segments.unshift(parent.item);
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
    return segments.join('/');
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

}


/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
