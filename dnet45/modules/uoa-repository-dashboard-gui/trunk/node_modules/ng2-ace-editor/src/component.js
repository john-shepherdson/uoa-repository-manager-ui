"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
require('brace');
require('brace/theme/monokai');
require('brace/mode/html');
var AceEditorComponent = (function () {
    function AceEditorComponent(elementRef) {
        this.textChanged = new core_1.EventEmitter();
        this.textChange = new core_1.EventEmitter();
        this.style = {};
        this._options = {};
        this._readOnly = false;
        this._theme = "monokai";
        this._mode = "html";
        this._autoUpdateContent = true;
        this._durationBeforeCallback = 0;
        this._text = "";
        this._onChange = function (_) {
        };
        this._onTouched = function () {
        };
        var el = elementRef.nativeElement;
        this._editor = ace["edit"](el);
    }
    AceEditorComponent.prototype.ngOnInit = function () {
        this.init();
        this.initEvents();
    };
    AceEditorComponent.prototype.init = function () {
        this.setOptions(this._options || {});
        this.setTheme(this._theme);
        this.setMode(this._mode);
        this.setReadOnly(this._readOnly);
    };
    AceEditorComponent.prototype.initEvents = function () {
        var _this = this;
        this._editor.on('change', function () { return _this.updateText(); });
        this._editor.on('paste', function () { return _this.updateText(); });
    };
    AceEditorComponent.prototype.updateText = function () {
        var newVal = this._editor.getValue(), that = this;
        if (newVal === this.oldText) {
            return;
        }
        if (typeof this.oldText !== 'undefined') {
            if (!this._durationBeforeCallback) {
                this._text = newVal;
                this.textChange.emit(newVal);
                this.textChanged.emit(newVal);
                this._onChange(newVal);
            }
            else {
                if (this.timeoutSaving) {
                    clearTimeout(this.timeoutSaving);
                }
                this.timeoutSaving = setTimeout(function () {
                    that._text = newVal;
                    that.textChange.emit(newVal);
                    that.textChanged.emit(newVal);
                    that.timeoutSaving = null;
                }, this._durationBeforeCallback);
            }
        }
        this.oldText = newVal;
    };
    Object.defineProperty(AceEditorComponent.prototype, "options", {
        set: function (options) {
            this.setOptions(options);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setOptions = function (options) {
        this._options = options;
        this._editor.setOptions(options || {});
    };
    Object.defineProperty(AceEditorComponent.prototype, "readOnly", {
        set: function (readOnly) {
            this.setReadOnly(readOnly);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setReadOnly = function (readOnly) {
        this._readOnly = readOnly;
        this._editor.setReadOnly(readOnly);
    };
    Object.defineProperty(AceEditorComponent.prototype, "theme", {
        set: function (theme) {
            this.setTheme(theme);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setTheme = function (theme) {
        this._theme = theme;
        this._editor.setTheme("ace/theme/" + theme);
    };
    Object.defineProperty(AceEditorComponent.prototype, "mode", {
        set: function (mode) {
            this.setMode(mode);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setMode = function (mode) {
        this._mode = mode;
        if (typeof this._mode === 'object') {
            this._editor.getSession().setMode(this._mode);
        }
        else {
            this._editor.getSession().setMode("ace/mode/" + this._mode);
        }
    };
    Object.defineProperty(AceEditorComponent.prototype, "value", {
        get: function () {
            return this.text;
        },
        set: function (value) {
            this.setText(value);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.writeValue = function (value) {
        this.setText(value);
    };
    AceEditorComponent.prototype.registerOnChange = function (fn) {
        this._onChange = fn;
    };
    AceEditorComponent.prototype.registerOnTouched = function (fn) {
        this._onTouched = fn;
    };
    Object.defineProperty(AceEditorComponent.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (text) {
            this.setText(text);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setText = function (text) {
        if (text === null || text === undefined) {
            text = "";
        }
        if (this._text !== text && this._autoUpdateContent === true) {
            this._text = text;
            this._editor.setValue(text);
            this._onChange(text);
            this._editor.clearSelection();
        }
    };
    Object.defineProperty(AceEditorComponent.prototype, "autoUpdateContent", {
        set: function (status) {
            this.setAutoUpdateContent(status);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setAutoUpdateContent = function (status) {
        this._autoUpdateContent = status;
    };
    Object.defineProperty(AceEditorComponent.prototype, "durationBeforeCallback", {
        set: function (num) {
            this.setDurationBeforeCallback(num);
        },
        enumerable: true,
        configurable: true
    });
    AceEditorComponent.prototype.setDurationBeforeCallback = function (num) {
        this._durationBeforeCallback = num;
    };
    AceEditorComponent.prototype.getEditor = function () {
        return this._editor;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AceEditorComponent.prototype, "textChanged", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], AceEditorComponent.prototype, "textChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AceEditorComponent.prototype, "style", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], AceEditorComponent.prototype, "options", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], AceEditorComponent.prototype, "readOnly", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], AceEditorComponent.prototype, "theme", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], AceEditorComponent.prototype, "mode", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AceEditorComponent.prototype, "value", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], AceEditorComponent.prototype, "text", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object), 
        __metadata('design:paramtypes', [Object])
    ], AceEditorComponent.prototype, "autoUpdateContent", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number), 
        __metadata('design:paramtypes', [Number])
    ], AceEditorComponent.prototype, "durationBeforeCallback", null);
    AceEditorComponent = __decorate([
        core_1.Component({
            selector: 'ace-editor',
            template: '',
            styles: [':host { display:block;width:100%; }'],
            providers: [{
                    provide: forms_1.NG_VALUE_ACCESSOR,
                    useExisting: core_1.forwardRef(function () { return AceEditorComponent; }),
                    multi: true
                }]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], AceEditorComponent);
    return AceEditorComponent;
}());
exports.AceEditorComponent = AceEditorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxxQkFBcUYsZUFBZSxDQUFDLENBQUE7QUFDckcsc0JBQXNELGdCQUFnQixDQUFDLENBQUE7QUFDdkUsUUFBTyxPQUFPLENBQUMsQ0FBQTtBQUNmLFFBQU8scUJBQXFCLENBQUMsQ0FBQTtBQUM3QixRQUFPLGlCQUFpQixDQUFDLENBQUE7QUFjekI7SUFlSSw0QkFBWSxVQUFzQjtRQWR4QixnQkFBVyxHQUFHLElBQUksbUJBQVksRUFBRSxDQUFDO1FBQ2pDLGVBQVUsR0FBRyxJQUFJLG1CQUFZLEVBQUUsQ0FBQztRQUNqQyxVQUFLLEdBQVEsRUFBRSxDQUFDO1FBQ3pCLGFBQVEsR0FBUSxFQUFFLENBQUM7UUFDbkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixXQUFNLEdBQVcsU0FBUyxDQUFDO1FBQzNCLFVBQUssR0FBUSxNQUFNLENBQUM7UUFDcEIsdUJBQWtCLEdBQVksSUFBSSxDQUFDO1FBRW5DLDRCQUF1QixHQUFXLENBQUMsQ0FBQztRQUNwQyxVQUFLLEdBQVcsRUFBRSxDQUFDO1FBMEdYLGNBQVMsR0FBRyxVQUFDLENBQU07UUFDM0IsQ0FBQyxDQUFDO1FBTU0sZUFBVSxHQUFHO1FBQ3JCLENBQUMsQ0FBQztRQTdHRSxJQUFJLEVBQUUsR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLENBQUM7SUFFRCxxQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxpQ0FBSSxHQUFKO1FBQ0ksSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEVB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Q0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxDQUFDOzs7T0FBQTtJQUVELHNEQUF5QixHQUF6QixVQUEwQixHQUFXO1FBQ2pDLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxHQUFHLENBQUM7SUFDdkMsQ0FBQztJQUVELHNDQUFTLEdBQVQ7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBektEO1FBQUMsYUFBTSxFQUFFOzsyREFBQTtJQUNUO1FBQUMsYUFBTSxFQUFFOzswREFBQTtJQUNUO1FBQUMsWUFBSyxFQUFFOztxREFBQTtJQTZEUjtRQUFDLFlBQUssRUFBRTs7O3FEQUFBO0lBU1I7UUFBQyxZQUFLLEVBQUU7OztzREFBQTtJQVNSO1FBQUMsWUFBSyxFQUFFOzs7bURBQUE7SUFTUjtRQUFDLFlBQUssRUFBRTs7O2tEQUFBO0lBaUJSO1FBQUMsWUFBSyxFQUFFOzttREFBQTtJQTJCUjtRQUFDLFlBQUssRUFBRTs7a0RBQUE7SUFpQlI7UUFBQyxZQUFLLEVBQUU7OzsrREFBQTtJQVFSO1FBQUMsWUFBSyxFQUFFOzs7b0VBQUE7SUExS1o7UUFBQyxnQkFBUyxDQUFDO1lBQ1AsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLEVBQUU7WUFDWixNQUFNLEVBQUUsQ0FBQyxxQ0FBcUMsQ0FBQztZQUMvQyxTQUFTLEVBQUUsQ0FBQztvQkFDUixPQUFPLEVBQUUseUJBQWlCO29CQUMxQixXQUFXLEVBQUUsaUJBQVUsQ0FBQyxjQUFNLE9BQUEsa0JBQWtCLEVBQWxCLENBQWtCLENBQUM7b0JBQ2pELEtBQUssRUFBRSxJQUFJO2lCQUNkLENBQUM7U0FDTCxDQUFDOzswQkFBQTtJQTRLRix5QkFBQztBQUFELENBQUMsQUEzS0QsSUEyS0M7QUEzS1ksMEJBQWtCLHFCQTJLOUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIE91dHB1dCwgRWxlbWVudFJlZiwgSW5wdXQsIGZvcndhcmRSZWYsIE9uSW5pdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7TkdfVkFMVUVfQUNDRVNTT1IsIENvbnRyb2xWYWx1ZUFjY2Vzc29yfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XHJcbmltcG9ydCAnYnJhY2UnO1xyXG5pbXBvcnQgJ2JyYWNlL3RoZW1lL21vbm9rYWknO1xyXG5pbXBvcnQgJ2JyYWNlL21vZGUvaHRtbCc7XHJcblxyXG5kZWNsYXJlIHZhciBhY2U6IGFueTtcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gICAgc2VsZWN0b3I6ICdhY2UtZWRpdG9yJyxcclxuICAgIHRlbXBsYXRlOiAnJyxcclxuICAgIHN0eWxlczogWyc6aG9zdCB7IGRpc3BsYXk6YmxvY2s7d2lkdGg6MTAwJTsgfSddLFxyXG4gICAgcHJvdmlkZXJzOiBbe1xyXG4gICAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxyXG4gICAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjZUVkaXRvckNvbXBvbmVudCksXHJcbiAgICAgICAgbXVsdGk6IHRydWVcclxuICAgIH1dXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBY2VFZGl0b3JDb21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0IHtcclxuICAgIEBPdXRwdXQoKSB0ZXh0Q2hhbmdlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuICAgIEBPdXRwdXQoKSB0ZXh0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG4gICAgQElucHV0KCkgc3R5bGU6IGFueSA9IHt9O1xyXG4gICAgX29wdGlvbnM6IGFueSA9IHt9O1xyXG4gICAgX3JlYWRPbmx5OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBfdGhlbWU6IHN0cmluZyA9IFwibW9ub2thaVwiO1xyXG4gICAgX21vZGU6IGFueSA9IFwiaHRtbFwiO1xyXG4gICAgX2F1dG9VcGRhdGVDb250ZW50OiBib29sZWFuID0gdHJ1ZTtcclxuICAgIF9lZGl0b3I6IGFueTtcclxuICAgIF9kdXJhdGlvbkJlZm9yZUNhbGxiYWNrOiBudW1iZXIgPSAwO1xyXG4gICAgX3RleHQ6IHN0cmluZyA9IFwiXCI7XHJcbiAgICBvbGRUZXh0OiBhbnk7XHJcbiAgICB0aW1lb3V0U2F2aW5nOiBhbnk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xyXG4gICAgICAgIGxldCBlbCA9IGVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcclxuICAgICAgICB0aGlzLl9lZGl0b3IgPSBhY2VbXCJlZGl0XCJdKGVsKTtcclxuICAgIH1cclxuXHJcbiAgICBuZ09uSW5pdCgpIHtcclxuICAgICAgICB0aGlzLmluaXQoKTtcclxuICAgICAgICB0aGlzLmluaXRFdmVudHMoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0KCkge1xyXG4gICAgICAgIHRoaXMuc2V0T3B0aW9ucyh0aGlzLl9vcHRpb25zIHx8IHt9KTtcclxuICAgICAgICB0aGlzLnNldFRoZW1lKHRoaXMuX3RoZW1lKTtcclxuICAgICAgICB0aGlzLnNldE1vZGUodGhpcy5fbW9kZSk7XHJcbiAgICAgICAgdGhpcy5zZXRSZWFkT25seSh0aGlzLl9yZWFkT25seSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdEV2ZW50cygpIHtcclxuICAgICAgICB0aGlzLl9lZGl0b3Iub24oJ2NoYW5nZScsICgpID0+IHRoaXMudXBkYXRlVGV4dCgpKTtcclxuICAgICAgICB0aGlzLl9lZGl0b3Iub24oJ3Bhc3RlJywgKCkgPT4gdGhpcy51cGRhdGVUZXh0KCkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRleHQoKSB7XHJcbiAgICAgICAgbGV0IG5ld1ZhbCA9IHRoaXMuX2VkaXRvci5nZXRWYWx1ZSgpLCB0aGF0ID0gdGhpcztcclxuICAgICAgICBpZiAobmV3VmFsID09PSB0aGlzLm9sZFRleHQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIHRoaXMub2xkVGV4dCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9kdXJhdGlvbkJlZm9yZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXh0ID0gbmV3VmFsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXh0Q2hhbmdlLmVtaXQobmV3VmFsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dENoYW5nZWQuZW1pdChuZXdWYWwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UobmV3VmFsKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRTYXZpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0U2F2aW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRTYXZpbmcgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGF0Ll90ZXh0ID0gbmV3VmFsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoYXQudGV4dENoYW5nZS5lbWl0KG5ld1ZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50ZXh0Q2hhbmdlZC5lbWl0KG5ld1ZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhhdC50aW1lb3V0U2F2aW5nID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH0sIHRoaXMuX2R1cmF0aW9uQmVmb3JlQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMub2xkVGV4dCA9IG5ld1ZhbDtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSBzZXQgb3B0aW9ucyhvcHRpb25zOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0T3B0aW9ucyhvcHRpb25zOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9vcHRpb25zID0gb3B0aW9ucztcclxuICAgICAgICB0aGlzLl9lZGl0b3Iuc2V0T3B0aW9ucyhvcHRpb25zIHx8IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSBzZXQgcmVhZE9ubHkocmVhZE9ubHk6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0UmVhZE9ubHkocmVhZE9ubHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFJlYWRPbmx5KHJlYWRPbmx5OiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9yZWFkT25seSA9IHJlYWRPbmx5O1xyXG4gICAgICAgIHRoaXMuX2VkaXRvci5zZXRSZWFkT25seShyZWFkT25seSk7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KCkgc2V0IHRoZW1lKHRoZW1lOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldFRoZW1lKHRoZW1lKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUaGVtZSh0aGVtZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fdGhlbWUgPSB0aGVtZTtcclxuICAgICAgICB0aGlzLl9lZGl0b3Iuc2V0VGhlbWUoYGFjZS90aGVtZS8ke3RoZW1lfWApO1xyXG4gICAgfVxyXG5cclxuICAgIEBJbnB1dCgpIHNldCBtb2RlKG1vZGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0TW9kZShtb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRNb2RlKG1vZGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuX21vZGUgPSBtb2RlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5fbW9kZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yLmdldFNlc3Npb24oKS5zZXRNb2RlKHRoaXMuX21vZGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvci5nZXRTZXNzaW9uKCkuc2V0TW9kZShgYWNlL21vZGUvJHt0aGlzLl9tb2RlfWApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKVxyXG4gICAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNldFRleHQodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0VGV4dCh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25DaGFuZ2UgPSAoXzogYW55KSA9PiB7XHJcbiAgICB9O1xyXG5cclxuICAgIHJlZ2lzdGVyT25DaGFuZ2UoZm46IGFueSkge1xyXG4gICAgICAgIHRoaXMuX29uQ2hhbmdlID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25Ub3VjaGVkID0gKCkgPT4ge1xyXG4gICAgfTtcclxuXHJcbiAgICByZWdpc3Rlck9uVG91Y2hlZChmbjogYW55KSB7XHJcbiAgICAgICAgdGhpcy5fb25Ub3VjaGVkID0gZm47XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRleHQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHNldCB0ZXh0KHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2V0VGV4dCh0ZXh0KTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRUZXh0KHRleHQ6IGFueSkge1xyXG4gICAgICAgIGlmICh0ZXh0ID09PSBudWxsIHx8IHRleHQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB0ZXh0ID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX3RleHQgIT09IHRleHQgJiYgdGhpcy5fYXV0b1VwZGF0ZUNvbnRlbnQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvci5zZXRWYWx1ZSh0ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5fb25DaGFuZ2UodGV4dCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvci5jbGVhclNlbGVjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSBzZXQgYXV0b1VwZGF0ZUNvbnRlbnQoc3RhdHVzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldEF1dG9VcGRhdGVDb250ZW50KHN0YXR1cyk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QXV0b1VwZGF0ZUNvbnRlbnQoc3RhdHVzOiBhbnkpIHtcclxuICAgICAgICB0aGlzLl9hdXRvVXBkYXRlQ29udGVudCA9IHN0YXR1cztcclxuICAgIH1cclxuXHJcbiAgICBASW5wdXQoKSBzZXQgZHVyYXRpb25CZWZvcmVDYWxsYmFjayhudW06IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuc2V0RHVyYXRpb25CZWZvcmVDYWxsYmFjayhudW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNldER1cmF0aW9uQmVmb3JlQ2FsbGJhY2sobnVtOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kdXJhdGlvbkJlZm9yZUNhbGxiYWNrID0gbnVtO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVkaXRvcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZWRpdG9yO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==