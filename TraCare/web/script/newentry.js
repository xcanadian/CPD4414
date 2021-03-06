/* 
    Document...: newentry.js
    Author.....: Dillon Young
    Description: The javascript file for the new entry process
*/

$(document).ready(function () {
    
    // Check to see if the map container is on the page
    if ($('#map-canvas').length > 0) {
        
        // Based on code from http://www.w3schools.com/html/html5_geolocation.asp
        // Check to see if the browser supports geo location
        if (navigator.geolocation)
        {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            showError();
        }
    }

    // Register the click listner for the add entry button
    $("#btn_addentry").on('click', function () {
        
        // Reset the error messages so they are not visible
        $('#error_weight').css('display', 'none');
        $('#error_sleep').css('display', 'none');
        $('#error_energy_level').css('display', 'none');
        $('#error_quality_of_sleep').css('display', 'none');
        $('#error_fitness').css('display', 'none');
        $('#error_nutrition').css('display', 'none');
        $('#error_symptom').css('display', 'none');
        $('#error_location').css('display', 'none');
        
        // Check to see if weight is being tracked for this entry
        if ($('#weight').length > 0) {
            
            // Check to see if the weight is set and is numeric
            if ($('#weight').val().length == 0) {
                $('#error_weight').text("* Weight is required and must be a numeric value");
                $('#error_weight').css('display', 'inline-block');
            } else if (isNaN($('#weight').val())) {
                $('#error_weight').text("* Weight must be a numeric value");
                $('#error_weight').css('display', 'inline-block');
            }
        }
        
        // Check to see if sleep is being tracked for this entry
        if ($('#sleep').length > 0) {
            
            // Check to see if the sleep is set and is numeric
            if ($('#sleep').val().length == 0) {
                $('#error_sleep').text("* Sleep is required and must be a numeric value");
                $('#error_sleep').css('display', 'inline-block');
            } else if (isNaN($('#weight').val())) {
                $('#error_sleep').text("* Sleep must be a numeric value");
                $('#error_sleep').css('display', 'inline-block');
            }
        }
        
        // Check to see if fitness activity is being tracked for this entry
        if ($('#fitness').length > 0) {
            
            // Check to see if a value has been entered
            if ($('#fitness').val().length == 0) {
                $('#error_fitness').text("* Please enter a description of your fitness activity");
                $('#error_fitness').css('display', 'inline-block');
            }
        }
        
        // Check to see if nutrition is being tracked for this entry
        if ($('#nutrition').length > 0) {
            
            // Check to see if a value has been entered
            if ($('#nutrition').val().length == 0) {
                $('#error_nutrition').text("* Please enter a description of your nutrition");
                $('#error_nutrition').css('display', 'inline-block');
            }
        }
        
        
        // Get the count of errors displayed and the total possible error count
        var error_count = $('span.error').filter(":hidden").size();
        var form_count = $('span.error').size();

        // Check to see if there are no errors displayed
        if (error_count == form_count) {
            
            // Create an object for the registration
            var newEntryData = new Object();
            newEntryData.weight = -1;
            newEntryData.sleep = -1;
            newEntryData.bloodpressure = -1;
            newEntryData.energylevel = -1;
            newEntryData.qualityofsleep = -1;
            newEntryData.fitness = "<{[blank]}>";
            newEntryData.nutrition = "<{[blank]}>";
            newEntryData.symptom = -1;
            newEntryData.symptomdescription = "<{[blank]}>";
            newEntryData.latitude = 0;
            newEntryData.longitude = 0;
            
            // Get the values entered by the user
            if ($('#weight').length > 0) { newEntryData.weight = $('#weight').val(); }
            if ($('#sleep').length > 0) { newEntryData.sleep = $('#sleep').val(); }
            if ($('#energy_level').length > 0) { newEntryData.energylevel = $('#energy_level').val(); }
            if ($('#quality_of_sleep').length > 0) { newEntryData.qualityofsleep = $('#quality_of_sleep').val(); }
            if ($('#fitness').length > 0) { newEntryData.fitness = $('#fitness').val(); }
            if ($('#nutrition').length > 0) { newEntryData.nutrition = $('#nutrition').val(); }
            if ($('#symptom').length > 0) { newEntryData.symptom = $('#symptom').val(); }
            if ($('#symptom_description').length > 0) { newEntryData.symptomdescription = $('#symptom_description').val(); }
            if ($('#latitude').length > 0) { newEntryData.latitude = $('#latitude').val(); }
            if ($('#longitude').length > 0) { newEntryData.longitude = $('#longitude').val(); }

            // Convert the object to JSON
            var query = JSON.stringify(newEntryData);

            $.ajax({
                type: "POST",
                url: "newentry_process.jsp",
                dataType: "json",
                data: { json: query },
                success: function (data) {
                    var response = data;

                    console.log(response.status);
                        
                    // Check to see if an internal error occurred
                    if (response.status == -2) {
                        displayMessage("An error occurred while saving the entry", 2);
                        
                    } else {
                        displayMessage("The entry has been successfully saved, please wait while you are redirected", 1);
                        window.setTimeout(function () { window.location.href = 'entrylist.jsp'; }, 3000);
                    }
                }
            });
        } else {
            
            displayMessage("There is an issue with one or more fields", 2);
        }
    });
});


/**
 * Shows the location of the user on a static Google map
 */
function showPosition(position) {

    // Declare variables
    var latlon=position.coords.latitude + "," + position.coords.longitude;
    var img_url="http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=16&size=600x200&" +
        "markers=color=blue%7Clabel:Position%7C" + latlon + "&sensor=true";
    
    // Set the image URL
    $('#map-canvas').attr('src', img_url);
    
    // Update the latitude and longitude values
    $('#latitude').val(position.coords.latitude);
    $('#longitude').val(position.coords.longitude);
}


/**
 * Shows a default location on a static Google map
 */
function showError(error) {
    
    // Declare variables
    var latlon=0 + "," + 0;
    var img_url="http://maps.googleapis.com/maps/api/staticmap?center=" + latlon + "&zoom=16&size=600x200&" +
        "markers=color=blue%7Clabel:Position%7C" + latlon + "&sensor=true";
    
    // Set the image URL
    $('#map-canvas').attr('src', img_url);
    
    // Update the latitude and longitude values
    $('#latitude').val(0.1);
    $('#longitude').val(0.1);
}