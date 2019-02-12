function modalWindowEdit(){
    var window = document.getElementById('modal-window');
    window.on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })
      /*
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus')
      })
      */
  }