$(document).ready(function () {
  let timerInterval;
  let log = [];
  let seconds = 0;
  let thresholds = [60, 90, 120];
  let startTime="";
  let stopTime="";

  //Get Current Time eg 13:30:45
  function getCurrentMountainTime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Denver', // Mountain Time timezone
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // 24-hour format
    });
  
    return formatter.format(now); // Returns a string in HH:MM:SS format
  }


  // Function to toggle button state
  function toggleButtonState(buttons) {
    buttons.each(function () {
      const isDisabled = $(this).prop('disabled');
      $(this).prop('disabled', !isDisabled);
    });
  }

  function setThresholds(times) {
    thresholds = times.split(',').map(Number);
  }

  // On speech type change
  $('#speech-type').on('change', function () {
    const selectedOption = $(this).find(':selected');
    const times = selectedOption.data('times');
    if ($(this).val() === 'custom') {
      $('#custom-modal').fadeIn();
    } else {
      setThresholds(times);
    }
  });

  // Save custom timing
  $('#save-custom').on('click', function () {
    const green = Number($('#custom-green').val());
    const yellow = Number($('#custom-yellow').val());
    const red = Number($('#custom-red').val());
    setThresholds(`${green},${yellow},${red}`);
    $('#custom-modal').fadeOut();
  });

  //Timer Start/Stop
  $('button').on('click', function () {
    const buttonId = this.id; // Get the id of the clicked button
    const $nameField = $('#name');
    const $timerField = $('#time');
    const $withinTimeField = $('#within-time');
    
    switch (buttonId) {
      case 'start-btn':
        if (!$nameField.val().trim()) {
          alert('Please enter a name!');
          return;
        }

        $("body").css( "background-color", "#f0f8ff" );

        // Disable name field and start button, enable stop button
        $nameField.prop('disabled', true);
        $('#start-btn').prop('disabled', true);
        $('#default-btn').prop('disabled', true);
        $('#green-btn').prop('disabled', true);
        $('#yellow-btn').prop('disabled', true);
        $('#red-btn').prop('disabled', true);
        $('#stop-btn').prop('disabled', false);

        // Start timer
        seconds = 0;
        startTime= getCurrentMountainTime();
        console.log(startTime);

        timerInterval = setInterval(() => {
          seconds++;
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          $timerField.val(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
          // Change background based on thresholds
          if (seconds >= thresholds[2]) {
            $('body').css('background-color', 'red');
          } else if (seconds >= thresholds[1]) {
            $('body').css('background-color', 'yellow');
          } else if (seconds >= thresholds[0]) {
            $('body').css('background-color', 'green');
          }
        }, 1000);
        break;

      case 'stop-btn':
        clearInterval(timerInterval);
        stopTime= getCurrentMountainTime();
        
        // Store log
        log.push({
          startT: startTime,
          stopT: stopTime, 
          name: $nameField.val().trim(),
          time: $timerField.val(),
          withinTime: $withinTimeField.is(':checked'),
        });

        updateLog();
        resetFields();
        $('#default-btn').prop('disabled', false);
        $('#green-btn').prop('disabled', false);
        $('#yellow-btn').prop('disabled', false);
        $('#red-btn').prop('disabled', false);

        break;
      case 'default-btn':
        $("body").css( "background-color", "#f0f8ff" );
        break;
      case 'green-btn':
        $("body").css( "background-color", "green" );
        break;
      case 'yellow-btn':
        $("body").css( "background-color", "yellow" );
        break;
      case 'red-btn':
        $("body").css( "background-color", "red" );
        break;  
      default:
        console.warn('Unhandled button click:', buttonId);
    }
  });

  function updateLog() {
    const $logList = $('#log-list');
    $logList.empty();
    log.forEach((entry, index) => {
      const logItem = `<li>${index + 1}. [${entry.startT} - ${entry.stopT}] ${entry.name} - ${entry.time} - ${
        entry.withinTime ? 'Within Time' : 'Over Time'
      }</li>`;
      $logList.append(logItem);
    });
  }

  function resetFields() {
    $('#name').val('').prop('disabled', false);
    $('#time').val('00:00');
    $('#start-btn').prop('disabled', false);
    $('#stop-btn').prop('disabled', true);
    $('body').css('background-color', '#f0f8ff'); // Reset background
  }
});