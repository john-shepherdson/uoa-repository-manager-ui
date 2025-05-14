import { Directive, ElementRef, HostListener, AfterViewInit } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[input]'
})
export class InputDirective implements AfterViewInit {
  private readonly input: HTMLElement;
  private textField: HTMLInputElement | HTMLTextAreaElement | null = null;
  private wrapper: HTMLElement | null = null;

  constructor(private el: ElementRef) {
    this.input = el.nativeElement;
  }

  ngAfterViewInit() {
    this.textField = this.input.querySelector('input, textarea');
    this.wrapper = this.input.querySelector('.input-wrapper');

    if (this.textField?.value) {
      this.wrapper?.classList.add('active');
    }

    this.textField?.addEventListener('input', () => {
      if (this.textField?.value) {
        this.wrapper?.classList.add('active');
      } else {
        this.wrapper?.classList.remove('active');
      }
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {

    event.stopPropagation();
    this.textField?.focus();
    this.wrapper?.classList.add('focused');

    // Blur all other inputs
    document.querySelectorAll('[input]').forEach((el: any) => {
      if (el !== this.input) {
        const tf = el.querySelector('input, textarea');
        const wr = el.querySelector('.input-wrapper');
        tf?.blur();
        wr?.classList.remove('focused');
      }
    });
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.textField?.blur();
    this.wrapper?.classList.remove('focused');
  }
}
