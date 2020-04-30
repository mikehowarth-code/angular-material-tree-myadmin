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
  id: string;
  label: string;
  cont: string;
  cust: string;
  debt: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  id: string;
  label: string;
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
  '2': {
    'label' : 'fuel is Gas',
    'o': {
      'CustomerId1': {
        'label' : 'Acme Customer 1',
        'o': {
          'DebtorId11': {'label' : 'Acme Debtor 11','leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
          'Debtorid12': {'label' : 'Acme Debtor 12','leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
          'DebtorId13': {'label' : 'Acme Debtor 13','leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
        }
      }
    }
  },
  '1': {
    'label' : 'fuel is Elecricity',
    'o': {
      'CustomerId2': {
        'label' : 'Acme Customer 2',
        'o': {
          'Debtorid1': {'label' : 'Acme Debtor 1', 'leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
        }
      }
    }
  },
  '3': {
    'label' : 'fuel is Water',
    'o': {
      'CustomerId3': {
        'label' : 'Acme Customer 3',
        'o': {
            'DebtorId2': {
              'label' : 'Acme Debtor 2',
              'o': {
                'ConnectionId1': {'label' : 'Acme Connection 1','leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
                'ConnectionId2': {'label' : 'Acme Connection 2','leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'},
                'ConnectionId3': {'label' : 'Acme Connection 3','leaf': true, 'cust': 'customerid1', 'cont': 'contractid1', 'debt': 'debtorid1'}
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
  AllData: TodoItemNode[] = [];
  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    const datum = '3';
    this.AllData = this.buildFileTree(TREE_DATA, 0);
    this.filter('');
    // Notify the change.
   // this.dataChange.next(this.AllData);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.id = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.item = value.label;
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

  public filter(datum: string) {
    console.log('filtering on ' + datum);
    const workingData: TodoItemNode[] = deepCopy(this.AllData);
    let displayData: TodoItemNode[] = [];
    if (datum !== '') {
      workingData.forEach(fuelNode => {
        const custNodesToRemove: TodoItemNode[] = [];
        fuelNode.children.forEach(custNode => {
          if (custNode.item.toLocaleLowerCase().indexOf(datum.toLocaleLowerCase()) < 0 ) {
            custNodesToRemove.push(custNode);
          }
        });
        fuelNode.children = fuelNode.children.filter( ( el ) => custNodesToRemove.indexOf( el ) );
      });
      workingData.forEach(fuelNode => {
        if (fuelNode.children.length > 0) {
          displayData.push(fuelNode);
        }
      });
    } else {
      displayData = workingData;
    }
    this.dataChange.next(displayData);
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
    flatNode.id = node.id;
    flatNode.label = node.label;
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
    segments.unshift(node.id);
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      segments.unshift(parent.id);
  //    this.checkRootNodeSelection(parent);
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

export const deepCopy = <T>(source: T): T => {
  if (source === null) {
    return source;
  }
  if (source instanceof Date) {
    return new Date(source.getTime()) as any;
  }
  if (source instanceof Array) {
    const cp = [] as any[];
    (source as any[]).forEach((v) => { cp.push(v); });
    return cp.map((n: any) => deepCopy<any>(n)) as any;
  }
  if (typeof source === 'object' && source !== {}) {
    const cp = { ...(source as { [key: string]: any }) } as { [key: string]: any };
    Object.keys(cp).forEach(k => {
      cp[k] = deepCopy<any>(cp[k]);
    });
    return cp as T;
  }
  return source;
};
