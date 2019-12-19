import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject} from 'rxjs';

/**
 * Node for to-do item
 */
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

/**
 * The Json object for to-do list data.
 */
const TREE_DATA_OLD = {
  Groceries: {
    'Almond Meal flour': null,
    'Organic eggs': null,
    'Protein Powder': null,
    Fruits: {
      Apple: null,
      Berries: ['Blueberry', 'Raspberry'],
      Orange: null
    }
  },
  Reminders: [
    'Cook dinner',
    'Read the Material Design spec',
    'Upgrade Application to Angular'
  ]
};
/**
 * The Json object for to-do list data.
 */
const TREE_DATA = {
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
 * The Json object for to-do list data.
 */
const TREE_DATA_SAFE = {
  'Gas': {
    't': 'folder',
    'o': {
      'Customer Name 1': {
        't': 'folder',
        'o': {
          'Debtor Name 1': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
          'Debtor Name 2': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
          'Debtor Name 3': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
        }
      }
    }
  },
  'Electricity': {
    't': 'folder',
    'o': {
      'Customer Name 1': {
        't': 'folder',
        'o': {
          'Debtor Name 1': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
        }
      }
    }
  },
  'Water': {
    't': 'folder',
    'o': {
      'Customer Name 1': {
        't': 'folder',
        'o': {
          'Debtor Name 1': {
            't': 'folder',
            'o': {
              'Connection 1': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
              'Connection 2': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
              'Connection 3': {'t': 'leaf', 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
            }
          }
        }
      }
    }
  }
};

/**
 * The Json object for to-do list data.
 */
const TREE_DATA_WIP = {
  'Gas': [
    {
      'Customer 1': [
        {
          'Debtor 1': {},
          'Debtor 2': {},
          'Debtor 3': {}
        }
      ]
    },
    {
      'Customer 2': [
      ]
    }

  ],
  'Electricity': [
  ]
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
            node.item = key + '/' + value.cust;
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
  selector: 'tree-checklist-example',
  templateUrl: 'tree-checklist-example.html',
  styleUrls: ['tree-checklist-example.css'],
  providers: [ChecklistDatabase]
})
export class TreeChecklistExample {
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
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
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
