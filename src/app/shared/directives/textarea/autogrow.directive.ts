import { Directive, ElementRef, Input, Output, HostBinding, HostListener, EventEmitter } from '@angular/core';

@Directive({
    selector: '[autogrow]'
})
export class AutogrowDirective {

    constructor(private el: ElementRef) {
    }

    @HostListener('keyup')
    onKeyUp() {
        this.el.nativeElement.style.height = '5px';
        this.el.nativeElement.style.height = (this.el.nativeElement.scrollHeight) + 'px';
    }

    @HostListener('keydown')
    onKeyDown() {
        this.el.nativeElement.style.height = '5px';
        this.el.nativeElement.style.height = (this.el.nativeElement.scrollHeight) + 'px';
    }
}
