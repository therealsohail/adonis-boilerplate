function ajaxPost(url, data, callback, formdata = true) {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    if (formdata) {
        $.ajax({
            method: "POST",
            url: url,
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'json',
            success: function (rdata) {
                callback(true, rdata)
            }, error: function (edata) {
                callback(false, edata)
            }
        });
    } else {
        $.ajax({
            method: "POST",
            url: url,
            data: data,
            cache: false,
            dataType: 'json',
            success: function (rdata) {
                callback(true, rdata)
            }, error: function (edata) {
                callback(false, edata)

            }
        });
    }

}

function ajaxGet(url, queryParam, callback) {
    $.ajax({
        method: "GET",
        url: url,
        data: queryParam,
        dataType: 'json',
        success: function (rdata) {
            callback(true, rdata)
        }, error: function (edata) {

            callback(false, edata)

        }
    });
}

$('.select2').select2()
if ($('body').has('#editor1').length > 0) {
    CKEDITOR.replace('editor1')
}
