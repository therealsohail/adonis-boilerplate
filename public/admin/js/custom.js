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

/*select2*/
$('.select2').select2()

/*CKEDITOR*/
if ($('body').has('#editor1').length > 0) {
    CKEDITOR.replace('editor1')
}

/*EXPORT, PDF OPTIONS IN DATATABLE*/
function dataTableInit(title, ordering=true, autowidth=false){
    let modelNameForPdf = ''
    if ($('body').has('#datatable').length > 0) {
        let headers = $("#datatable th").length
        let columnSize = [];
        for (i = 0; i < headers - 1; i++) {
            columnSize.push(i)
        }
        $('#datatable').DataTable({
            "paging": true,
            "lengthChange": true,
            "searching": true,
            "ordering": ordering,
            "info": true,
            "autoWidth": autowidth,
            "responsive": true,
            "dom": 'Bfrtip',
            "buttons": [
                {
                    extend: "pageLength"
                },
                {
                    extend: 'csvHtml5',
                    title: "{{title}}",
                    text: 'Export CSV',
                    exportOptions: {
                        columns: columnSize,
                        //stripHtml: false => for image html
                    }
                },
                {
                    extend: 'pdfHtml5',
                    title: title,
                    text: 'Export PDF',
                    exportOptions: {
                        columns: columnSize
                    }
                }
            ]
        });
    }
}

/**/