import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'dropdown-menu',
    styleUrls: ['./dropdown-menu.component.scss'],
    templateUrl: './dropdown-menu.component.html'
})
export class DropdownMenuComponent {
    @Output() selected = new EventEmitter<number>();
    items: { id: number, label: string }[];
    position: {x: number, y: number};
    visible: boolean;

    setItems(items: number[], label: string) {
        const dropdownMenu = [];
        items.map(item => dropdownMenu.push({ id: item, label: `${label}${item}` }));
        // console.log('dropdownMenu', dropdownMenu);
        this.items = dropdownMenu;
    }
    selectItem(item: {id: number, label: string}) {
        this.visible = false;
        this.selected.emit(item.id);
    }
}
