import { Component, Input, OnInit, OnDestroy, ElementRef, Output, EventEmitter } from '@angular/core';
import { ModalService } from './modal-window.service';

@Component({
    selector: 'modal-window',
    styleUrls: ['./modal-window.component.scss'],
    templateUrl: './modal-window.component.html'
})

export class ModalWindowComponent implements OnInit, OnDestroy {
    @Input() id: string;
    @Output() closeModal = new EventEmitter<void>();
    private element: any;
    private containerWidth: number;

    constructor(private modalService: ModalService, private el: ElementRef) {
        this.element = el.nativeElement;
    }

    ngOnInit(): void {
        const modal = this;

        // ensure id attribute exists
        if (!this.id) {
            console.error('modal must have an id');
            return;
        }

        let leftContent = document.getElementsByClassName('content__panel')[0];
        this.containerWidth = leftContent.clientWidth;
        let modalWindow = this.element.querySelector('.modal-window');
        // modalWindow.style.width = `${this.containerWidth + 11}px`;
        // modalWindow.style.left = `${-this.containerWidth - 11}px`;

        modalWindow.style.width  = '500px';
        modalWindow.style.left = '-500px';

        // move element to bottom of page (just before </body>) so it can be displayed above everything else
        document.body.appendChild(this.element);

        const closeModal = this.closeModal;
        // close modal on background click
        this.element.addEventListener('click', function (e: any) {
            if (e.target.className === 'modal-background') {
                modal.close();
                closeModal.emit()
            }
        });

        // add self (this modal instance) to the modal service so it's accessible from controllers
        this.modalService.add(this);

        leftContent = null;
        modalWindow = null;
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
        this.modalService.remove(this.id);
        this.element.remove();
        this.element = null;
    }

    // open modal
    open(): void {
        let modalWindow = document.getElementById('modal-window');
        // modalWindow.style.left = 0;
        modalWindow.classList.add('open');
        this.element.style.display = 'block';
        document.body.classList.add('modal-open');
        modalWindow = null;
    }

    // close modal
    close(): void {
        this.element.style.display = 'none';
        const modalWindow = this.element.querySelector('.modal-window');
        // modalWindow.style.left = `${-this.containerWidth - 11}px`;
        modalWindow.classList.remove('open');
        document.body.classList.remove('modal-open');
    }
}
