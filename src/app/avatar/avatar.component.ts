import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

const defaultColors = [
  '#1abc9c',
  '#3498db',
  '#f1c40f',
  '#8e44ad',
  '#e74c3c',
  '#d35400',
  '#2c3e50',
  '#7f8c8d'
];

type Style = Partial<CSSStyleDeclaration>;

const enum AvatarSource {
  IMAGE = 'src',
  NAME = 'name'
}

const avatarSources: AvatarSource[] = [AvatarSource.IMAGE, AvatarSource.NAME];

@Component({
  selector: 'app-avatar',
  templateUrl: 'avatar.html',
  styles: [`
    :host {
      border-radius: 50%;
      display: inline-block;
    }
  `]
})
export class AvatarComponent implements OnChanges {
  @Input() size: string | number = 50;
  @Input() textSizeRatio = 3;
  @Input() bgColor: string = '';
  @Input() style: Style = {};
  @Input() src: string = '';
  @Input() name: string = '';
  @Input() initialsSize: string | number = 0;

  avatarSrc = '';
  avatarText= '';
  avatarStyle: Style = {};
  hostStyle: Style = {};
  sources = [
    {source: AvatarSource.IMAGE, valid: true},
    {source: AvatarSource.NAME, valid: true}
  ];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (avatarSources.includes(propName as AvatarSource)) {
        this.sources.forEach(s => {
          if (s.source === propName) {
            s.valid = !!(changes[propName].currentValue);
          }
        });
      }
    }
    this.initializeAvatar();
  }

  private initializeAvatar() {
    if (this.sources.filter(s => s.valid === true).length === 0) {
      return;
    } else {
      const source = this.sources.filter(s => s.valid === true)[0];
      this.buildAvatar(source.source);
    }
  }

  buildAvatar(source: AvatarSource) {
    this.hostStyle = {
      width: this.size + 'px',
      height: this.size + 'px'
    };

    if (source === AvatarSource.IMAGE) {
      this.buildImageAvatar();
    } else {
      this.buildTextAvatar();
    }
  }

  private buildTextAvatar() {
    this.avatarText = this.getInitials(this.name, +this.initialsSize);
    this.avatarStyle = this.getTextAvatarStyle(this.avatarText);
  }

  private buildImageAvatar() {
    this.avatarSrc = this.src;
    this.avatarStyle = this.getImageAvatarStyle();
  }

  getInitials(name: string, size: number): string {
    if (!name) {
      return '';
    }

    name = name.trim();

    if (!name) {
      return '';
    }

    const initials = name.split(' ');
    if (size && size < initials.length) {
      return this.constructInitials(initials.slice(0, size));
    } else {
      return this.constructInitials(initials);
    }
  }

  private constructInitials(elements: string[]): string {
    if (!elements || !elements.length) {
      return '';
    }
    return elements
      .filter(element => element && element.length > 0)
      .map(element => element[0].toUpperCase())
      .join('');
  }


  getRandomColor(avatarText: string): string {
    if (!avatarText) {
      return 'transparent';
    }
    const asciiCodeSum = this.calculateAsciiCode(avatarText);
    return defaultColors[asciiCodeSum % defaultColors.length];
  }

  private calculateAsciiCode(value: string): number {
    return value
      .split('')
      .map(letter => letter.charCodeAt(0))
      .reduce((previous, current) => previous + current);
  }

  private getImageAvatarStyle(): Style {
    return {
      maxWidth: '100%',
      borderRadius: '50%',
      border: '',
      width: this.size + 'px',
      height: this.size + 'px',
      ...this.style,
    };
  }

  private getTextAvatarStyle(avatarValue: string): Style {
    return {
      textAlign: 'center',
      borderRadius: '50%',
      border: '',
      textTransform: 'uppercase',
      color: '#FFF',
      backgroundColor: this.bgColor
        ? this.bgColor
        : this.getRandomColor(avatarValue),
      font: Math.floor(+this.size / this.textSizeRatio) + 'px Helvetica, Arial, sans-serif',
      lineHeight: this.size + 'px',
      ...this.style
    };
  }

  failImageAvatar() {
    this.avatarSrc = '';
    this.sources.forEach(s => {
      if (s.source === AvatarSource.IMAGE) {
        s.valid = false;
      }
    });
    this.initializeAvatar();
  }
}
