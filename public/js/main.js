function deleteEvent() {
    let btn = document.getElementById('deleteBtn');
    let id = btn.getAttribute('data-id');
    axios.delete(`/events/delete/${id}`)
        .then((res) => {
            window.location.href = '/events'
        })
        .catch((err) => {
            console.log(err);
        })
}
function deleteComment() {
    let btn = document.getElementById('deleteCommentBtn');
    let comment_id = btn.getAttribute('comment-id');
    let event_id = btn.getAttribute('event-id');
    axios.delete(`/events/deleteComment/${comment_id}`)
        .then((res) => {
            window.location.href = '/events/' + event_id
        })
        .catch((err) => {
            console.log(err);
        })
}
function deleteAllEvent() {
    let btn = document.getElementById('deleteAllBtn');
    axios.delete(`/users/profile`)
        .then((res) => {
            window.location.href = '/users/profile'
        })
        .catch((err) => {
            console.log(err);
        })
}
function scrollToBottomOfComments() {
    let comments_container = document.getElementsByClassName('comments-container')[0];
    comments_container.scrollTo({
        top: comments_container.scrollHeight,
        behavior: 'smooth'
    });
}
if(window.location.pathname.includes('/events/'+/[^a-zA-Z0-9]/g)){
    window.onload = function () {
        scrollToBottomOfComments();
    };
}
function submitComment() {
    let commentInput = document.getElementById('commentInput');
    let action = document.getElementById('submitCommentBtn').getAttribute('data-id')
    let commentText = commentInput.value.trim();
    let commentsList = document.getElementById('commentsList');
    if (commentText) {
        $.ajax({
            url: action,
            type: 'POST',
            contentType: "application/json",
            dataType: 'json',
            data: JSON.stringify({ commentText }),
            success: (comment) => {
                commentsList.innerHTML += `
                    <div class="comment">
                        <div class="row">
                        <div class="col-md-6">
                        <div class="user">${comment.user_name}</div>
                        </div>
                        <div class="col-md-6 text-end">
                        <div class="timestamp">${comment.createdAt}</div>
                        </div>
                        </div>
                        <div class="row">
                        <div class="col-md-10">
                        <div class="content">${comment.commentText}</div>
                        </div>
                        <div class="col-md-2 text-center">
                        <a class="btn btn-secondary" href="/events/deleteComment/${comment._id}" id="deleteCommentBtn">Delete</a>
                        </div>
                        </div>
                    </div>
                `
                scrollToBottomOfComments();
                commentInput.value = '';
            },
            failure: (fail) => {
                console.log(fail);
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}
if (window.location.pathname == '/users/profile') {
    $(document).ready(function () {
        $('#avatar').change(function () {
            var fileName = $(this).val();
            if (fileName) {
                $('#uploadBtn').removeAttr('disabled');
                $('#uploadBtn').removeClass('btn-primary').addClass('btn-success');
            } else {
                $('#uploadBtn').attr('disabled', 'disabled');
                $('#uploadBtn').removeClass('btn-success').addClass('btn');
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const editBtn = document.getElementById('editBtn');
        const saveBtn = document.getElementById('saveBtn');
        const profileForm = document.getElementById('profileForm');
        const formFields = document.querySelectorAll('#profileForm input');

        editBtn.addEventListener('click', function () {
            formFields.forEach(field => {
                field.removeAttribute('disabled');
            });
            editBtn.classList.add('d-none');
            saveBtn.classList.remove('d-none');
        });

        saveBtn.addEventListener('click', function () {
            profileForm.setAttribute('action', '/users/profile');
            profileForm.setAttribute('method', 'Post');
            profileForm.submit();
        });

        // Add event listener to capture clicks outside of the form
        document.addEventListener('click', function (event) {
            const isClickedInsideForm = profileForm.contains(event.target);
            if (!isClickedInsideForm) {
                formFields.forEach(field => {
                    field.setAttribute('disabled', true);
                });
                editBtn.classList.remove('d-none');
                saveBtn.classList.add('d-none');
            }
        });
    });
}
$(document).ready(function () {
    // When a tab is clicked
    $('a[data-toggle="tab"]').on('click', function () {
        // Save the active tab's href (id) in local storage
        var activeTab = $(this).attr('href');
        localStorage.setItem('activeTab', activeTab);
    });

    // On page load, check if there is an active tab stored
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        // Show the active tab
        $('#myTab a[href="' + activeTab + '"]').tab('show');
    }
});