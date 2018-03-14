define(
    'helpers/Date/format-date',
    function() {

        function formatDate(date, format, utc) {
            var MM = ['\x00', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            function ii(i, len) { var s = i + ''; len = len || 2; while (s.length < len) s = '0' + s; return s; }

            var y = utc ? date.getUTCFullYear() : date.getFullYear();
            format = format.replace(/(^|[^\\])yy+/g, '$1' + y);

            var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
            format = format.replace(/(^|[^\\])MM+/g, '$1' + MM[0]);

            var d = utc ? date.getUTCDate() : date.getDate();
            format = format.replace(/(^|[^\\])dd/g, '$1' + ii(d));

            format = format.replace(new RegExp(MM[0], 'g'), MM[M]);

            return format;
        }

    return formatDate;
});