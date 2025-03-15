import {Pipe, PipeTransform} from '@angular/core';

const iconMapping = {
  maps: 'bi-pin-map',
  'teams.microsoft.com': 'bi-microsoft-teams',
  'meet.google.com': 'bi-google',
  discord: 'bi-discord',
  'zoom.us': 'bi-camera-video bi-zoom',
} as const;

@Pipe({
  name: 'locationIcon',
  standalone: false,
})
export class LocationIconPipe implements PipeTransform {

  transform(location: string): string {
    location = location.toLowerCase();
    for (const [key, value] of Object.entries(iconMapping)) {
      if (location.includes(key)) {
        return value;
      }
    }
    if (location.startsWith('http')) {
      return 'bi-globe';
    }
    return 'bi-geo';
  }

}
