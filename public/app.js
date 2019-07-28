// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// save-article-button
$(document).on("click", ".save-article-btn", function() {
  const articleId = $(this).data("id")
  const title = $(this).data("title");
  alert(`saved Article ${title}`);

  $.ajax({
    method: "PUT",
    url: "/api/saved/" + articleId
  })
  .then(function(data) {
    console.log(data);
  });
});

// save notes-btn
$(document).on("click", ".notes-btn", function() {
  const articleId = $(this).data("id")
  const articleTitle = $(this).data("title");
  const notesSection = $("#notes");
  notesSection.empty();

  function postNote() {
      $(notesSection).append("<h4>" + articleTitle + "</h4>");
      // An input to enter a new title
      $(notesSection).append("<label for=\"titleinput\">Note title:&nbsp;</label><input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $(notesSection).append("<label for=\"bodyinput\">Note body:&nbsp;</label><textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $(notesSection).append("<button class='btn-info' data-id='" + articleId + "' id='save-note'>Save Note</button>");
  }

  function populateNotes() {
    $.ajax({
      method: "GET",
      url: "/api/articles/" + articleId
    })
    .done(function(data) {
      const notesDiv = $("<div>");

      $.each(data.note, function(index, elem){
        const headerNote = $("<h2>");
        const bodyNote = $("<p>").addClass("note-body");
        headerNote.html(elem.title);
        bodyNote.html(elem.body);
        notesDiv.append(headerNote, bodyNote);
      });
      notesSection.append(notesDiv);
      postNote();
    })
    .fail(function(err) {
      console.log(err);
    })
  }

  populateNotes();
});

$(document).on("click", "#save-note", function() {
  const articleId = $(this).data("id");
  $.ajax({
    method: "POST",
    url: "/api/articles/" + articleId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
     // Log the response
     console.log(data);
     // Empty the notes section
     $("#notes").empty();
  });
  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
