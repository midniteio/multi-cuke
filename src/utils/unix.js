export function indent(number) {
  let padding = '';
  for (var i = 0; i < number; i++) {
    padding += '  ';
  }
  return padding;
};

export function colorize(text, color) {
  let colors = {
    gray: '\x1B[2m\x1B[37m',
    red: '\x1B[31m',
    green: '\x1B[32m',
    yellow: '\x1B[33m',
    cyan: '\x1B[36m',
    purple: '\x1B[35m',
  };
  return colors[color] + text + '\x1B[0m';
};

export const buffer = {
  data: '',
  log: function(text) {
    this.data += text + '\n';
  },
  dump: function() {
    let bufferedData = this.data;
    this.data = '';
    return bufferedData;
  }
}
