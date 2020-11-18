/*
 *  Adding this to an HTML5 input element
 *  allows for the file being read to be converted into a Mobius
 *  Flowchart
 *
 */
import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[autogrow]'
})
export class AutogrowDirective {

    constructor(private textArea: ElementRef) {
    }

    @HostListener('keyup') onKeyUp() {
        this.textArea.nativeElement.style.overflow = 'hidden';
        this.textArea.nativeElement.style.height = '1px';
        this.textArea.nativeElement.style.height = this.textArea.nativeElement.scrollHeight + 'px';
    }
}
