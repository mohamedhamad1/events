$(document).ready(function() {
    $('#commentForm').submit(function(event) {
        event.preventDefault(); // Prevent the form from submitting normally
        // Get the comment text
        var commentText = $('.commentTextArea').val();
        console.log(commentText);
        // Send the comment data to the server using AJAX
        $.ajax({
            type: 'POST',
            url: $('#commentForm').attr('action'), // Get the form action URL
            data: { commentText },
            success: function(res) {
                // Upon successful submission, append the new comment to the comments list
                $('#commentsList').append('<li>' + res.commentText + '</li>');
                
                // Clear the textarea after submission
                $('.commentTextArea').val('');
            },
            error: function(xhr, status, error) {
                // Handle errors here
                console.error(error);
            }
        });
    });
});
console.log('test');