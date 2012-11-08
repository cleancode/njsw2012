/*jshint jquery: true*/

$(function() {

  $.mobile.changePage("#buy")

  $("#buy .album_choose").click(function(ev) {
    ev.preventDefault()

    var code = $(this).data("code")
    var title = $(this).data("title")
    var priceTag = $(this).data("pricetag")

    $("#pay")
      .find(".pay_code").val(code).end()
      .find(".pay_description").text(title + " - " + priceTag)

    $.mobile.changePage("#pay")
  })

  $("#pay .pay_button").click(function(ev) {
    ev.preventDefault()

    var showThankyou = function() {
      $.mobile.changePage("#thankyou")
    }

    var showSorry = function() {
      $.mobile.changePage("#sorry")
    }

    var $form = $("#pay .pay_form")
    var url = location.pathname + "/buy"
    $.post(url, $form.serialize())
     .done(showThankyou)
     .fail(showSorry)
  })

})

