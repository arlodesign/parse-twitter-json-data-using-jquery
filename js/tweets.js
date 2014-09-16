// Global variables for "summary" incrementors
var numberFollowUp = 0;
var numberTweets = 0;


/**
* Helper function for formatting dates from the JSON data
*
* @function formatDate
* @param {date} takes in the `created_at` key from our JSON data
* @return {displayDate} properly formatted date
*/
function formatDate(date) {
  var dateSplit = date.split(" ");
  var displayDate = dateSplit[0] + ", " + dateSplit[1] + " " + dateSplit[2];

  // Return the proper date
  return displayDate;
}


/**
* Helper function for hiding the first element that matches
* the {selector} parameter in the {parent} parameter.
*
* @function hideClosest
* @param {parent} which parent element to traverse
* @param {selector} which selector to find in {parent}
*/
function hideClosest(parent, selector) {
  $(parent).click(function() {
    if(confirm("Are you sure you want to delete this tweet?")) {
      $(this).closest(selector).fadeOut();

      numberTweets--;

      $('.tweets-total .total').text(numberTweets);
    }
  });
}


/**
* Helper function for adding follow-ups

* @function addFollowUp
* @param {id} ID selector for each individual tweet
*/
function addFollowUp(id) {
  $(id).change(function() {
    // If "Follow Up" has been clicked
    if(this.checked) {
      numberFollowUp++;

      $('.tweets-follow-up .total').html(numberFollowUp);
    } else {
      numberFollowUp--;

      $('.tweets-follow-up .total').html(numberFollowUp);
    }
  });
}


$(document).ready(function() {
  // Start AJAX request
  $.ajax({
    url: "https://gist.githubusercontent.com/arlodesign/7d80edb6e801e92c977a/raw/24605c9e5de897f7877b9ab72af13e5b5a2e25eb/tweets.json",
    dataType: "text",
    success: function(data) {
      // Store the JSON data
      var tweetData = $.parseJSON(data);

      // Loop through JSON values and build the table
      $.each(tweetData.tweets, function(index, item) {
        // Count number of tweets
        numberTweets++;

        // Build and append table rows for each JSON value
        $('.tweets-result').append(
          '<tr class="' + item.id + '">' +
            '<td class="tweet-avatar"><img src="' + item.profile_image_url + '" alt="@' + item.screen_name + ' avatar"></td>' +
            '<td><a href="https://twitter.com/' + item.screen_name + '" target="_blank">@' + item.screen_name + '</a></td>' +
            '<td>' + item.text + '</td>' +
            '<td class="tweet-date">' + formatDate(item.created_at) + '</td>' +
            '<td class="tweet-options"><input id="follow-up-' + item.id + '" type="checkbox" /> Follow Up' +
                 '<a id="remove-tweet-' + item.id + '" class="tweet-remove btn btn-extra-small full bg-red">Remove</a>' +
            '</td>' +
          '</tr>'
        );+

        // Count tweets marked for follow-up
        addFollowUp("#follow-up-" + item.id);

        // Hide table row when "Remove" is clicked
        hideClosest("#remove-tweet-" + item.id, "tr");
      });

      // Use `datatables` plugin to add sorting
      $('.table-sort').dataTable({
        // Set which columns are sortable
        "columns": [
          { "orderable": false },
          null,
          { "orderable": false },
          null,
          { "orderable": false }
        ],
        // By default, order the 3rd column ascending
        "order": [3, 'asc'],
        // Save the state of the table order in a cookie
        stateSave: true
      });

      // Display total number of tweets
      $('.tweets-total .total').text(numberTweets);
    }
  });
});
