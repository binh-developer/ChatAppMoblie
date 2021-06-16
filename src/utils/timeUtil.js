import moment from 'moment';

export function formatDateFull(seconds) {
  if (seconds) {
    return moment(seconds).format('lll');
  }
}

export function formatTime(seconds) {
  if (seconds) {
    return moment(seconds).format('H:mm:ss');
  }
}

export function formatDate(seconds) {
  if (seconds) {
    return moment(seconds).format('DD-MM-YYYY');
  }
}
