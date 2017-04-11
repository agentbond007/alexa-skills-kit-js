var Alexa = require('alexa-sdk');

// Used when user asks for help.
var HelpMessage = "Here are some things you can say to learn more about chess: How do I play? Tell me about the King. How do I win? Give me a tip!";

// Used when the skill is opened.
var welcomeMessage = "Chess Helper. You can ask how to set up the game, about an individual piece, what the rules are, how to win, or for a chess tip. Which will it be?";

// We are using this after every piece of information has been read out by Alexa, however this is also used as a repromt string.
var repromtMessage = "Here are some things you can ask for: ";

// Describing the game overview.
var overviewMessage = "The Player controlling the white pieces is named 'White'; the player controlling the black pieces is named 'Black'. White moves first, then players alternate moves. Making a move is required; It is not legal to skip a move, even when having to move is detrimental. Play continues until a king is checkmated, a player resigns, or a draw is declared. Read more on your device. ";

// Describing how to set the game up.
var setupMessage = "Chess is played on a chessboard, a square board divided into 64 squares (eight-by-eight) of alternating color. No matter what the actual colors of the board, the lighter colored squares are called \"Light\" or \"White\", and the darker-colored squares are called \"Dark\" or \"Black\". Sixteen \"white\" and sixteen \"black\" pieces are placed on the board at the begining of the game. The board is placed so that a white square is in each player's near right corner. ";

// Used for home card
var setupImageLarge = "https://s3.amazonaws.com/gamehelperimages/board_large.png";

// Used for home card
var setupImageSmall = "https://s3.amazonaws.com/gamehelperimages/board_small.png";

// Describing how to win the game.
var goalMessage = "The goal of the game is to checkmate, that is, to threaten the opponent's king with inevitable capture. ";

// Any error messages.
var errorMessage = "Sorry I couldn't find that piece, please try again.";

// Used when a user says cancel, stop or no longer wants to hear any more posts.
var stopSkillMessage = "Ok, see you next time!";

// Used after describing a chess piece.
var pieceMessage = "What other pieces would you like to hear about?";

var howToPlayCardTitle = "How to play";

var settingUpCardTitle = "Setting up";

// List of tips, a random object will be pulled from this list, can add as many or as little as you like, however the smaller the number of tips in here the more you will hear the same tips.
var tips = [
    "Control the centre of the board.",
    "Move knights and bishops into the centre of the board early.",
    "Try to think about what your opponent can do, and try to think of a move before they are finished.",
    "Always make sure before completing your move, that the king is safe",
    "Try to force your opponent to make moves you are ready for",
    "Do not rush, take your time and make sure the move is correct.",
    "Have a plan, and adapt as the game progresses.",
    "Stay calm, even if you are losing, your opponent can still make a mistake."];

// Used to randomise the repromt text.
var repromts = [
    "Which would you like to know: a chess tip or how to win?",
    "Tell me the name of an individual piece to learn more about it.",
    "Which would you like to know: how to set up the game or what the rules are?"];

// A list of objects representing the chess pieces, this object consists of three properties
// Key: name of the piece.
// Image: will be used on the card to show the piece being described.
// value: text describing the piece.

var pieces = [
    { key: "king", imageLarge: "https://s3.amazonaws.com/gamehelperimages/king_large.png", imageSmall: "https://s3.amazonaws.com/gamehelperimages/king_small.png", value: "In chess, the king is the most important piece. The object of the game is to threaten the opponent's king in such a way that escape is not possible (checkmate). A king can move one square in any direction (horizontally, vertically, or diagonally) unless the square is already occupied by a friendly piece or the move would place the king in check. As a result, the opposing kings may never occupy adjacent squares." },
    { key: "queen", imageLarge: "https://s3.amazonaws.com/gamehelperimages/queen_large.png", imageSmall: "https://s3.amazonaws.com/gamehelperimages/queen_small.png", value: "The queen is the most powerful piece in the game of chess, able to move any number of squares vertically, horizontally or diagonally. Each player starts the game with one queen, placed in the middle of the first rank next to the king." },
    { key: "rook", imageLarge: "https://s3.amazonaws.com/gamehelperimages/rook_large.png", imageSmall: "https://s3.amazonaws.com/gamehelperimages/rook_small.png", value: "A rook (borrowed from Persian \"chariot\") is a piece in the strategy board game of chess. Formerly the piece was called the tower, marquess, rector, and comes (Sunnucks 1970). The term castle is considered informal, incorrect, or old-fashioned. The Rook moves horizontally or vertically, through any number of unoccupied squares." },
    { key: "bishop", imageLarge: "https://s3.amazonaws.com/gamehelperimages/bishop_large.png", imageSmall: "https://s3.amazonaws.com/gamehelperimages/bishop_small.png", value: "A bishop is a piece in the board game of chess. Each player begins the game with two bishops. One starts between the king's knight and the king, the other between the queen's knight and the queen. The bishop has no restrictions in distance for each move, but is limited to diagonal movement. Bishops, like all other pieces except the knight, cannot jump over other pieces. A bishop captures by occupying the square on which an enemy piece sits." },
    { key: "knight", imageLarge: "https://s3.amazonaws.com/gamehelperimages/knight_large.png", imageSmall: "https://s3.amazonaws.com/gamehelperimages/knight_small.png", value: "The knight is a piece in the game of chess, representing a knight (armored cavalry). It is normally represented by a horse's head and neck. Each player starts with two knights, which begin on the row closest to the player, one square from each corner.The knight move is unusual among chess pieces. When it moves, it can move to a square that is two squares horizontally and one square vertically, or two squares vertically and one square horizontally. The complete move therefore looks like the letter L. Unlike all other standard chess pieces, the knight can 'jump over' all other pieces (of either color) to its destination square." },
    { key: "pawn", imageLarge: "https://s3.amazonaws.com/gamehelperimages/pawn_large.png", imageSmall: "https://s3.amazonaws.com/gamehelperimages/pawn_small.png", value: "The pawn is the most numerous piece in the game of chess, and in most circumstances, also the weakest. It historically represents infantry, or more particularly, armed peasants or pikemen. Each player begins a game of chess with eight pawns, one on each square of the rank immediately in front of the other pieces. Unlike the other pieces, pawns may not move backwards. Normally a pawn moves by advancing a single square, but the first time a pawn is moved, it has the option of advancing two squares. Pawns may not use the initial two-square advance to jump over an occupied square, or to capture." }
];

// Attaching handlers
// Here we have added the following handlers:
// NewSession: envoked when the skill is first started.
// HelpIntent: envoked when a user asks for help.
// StopIntent/CancelIntent: envoked when a user asks to end the skill.
// OverviewIntent: give an overview of the game
// SetupIntent: how to set the game up
// GoalIntent: how to win the game
// TipIntent: select a random tip for the game.
// PieceIntent: Added specifically for chess to describe the pieces.

var handlers = {
    'LaunchRequest': function () {
        console.log("welcome");
        this.emit(':ask', welcomeMessage, GetReprompt());
    },
    'Unhandled': function () {
        this.emit(':ask', welcomeMessage, GetReprompt());
    },

    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HelpMessage, HelpMessage);
    },

    'AMAZON.StopIntent': function () {
        this.shouldEndSession = true;
        this.emit(':tell', stopSkillMessage, stopSkillMessage);
    },

    'AMAZON.CancelIntent': function () {
        this.shouldEndSession = true;
        this.emit(':tell', stopSkillMessage, stopSkillMessage);
    },

    'OverviewIntent': function () {
        var speechOutput = overviewMessage+" "+GetReprompt();
        var repromptOutput = GetReprompt();

        this.emit(':askWithCard', speechOutput, repromptOutput, howToPlayCardTitle, overviewMessage);
    },

    'SetupIntent': function () {
        // Create image object for home card
        var imageObj = {
            smallImageUrl: setupImageSmall,
            largeImageUrl: setupImageLarge
        };

        var speechOutput = setupMessage+" "+GetReprompt();
        var repromptOutput = GetReprompt();

        this.emit(':askWithCard', speechOutput, repromptOutput, settingUpCardTitle, setupMessage, imageObj);
    },

    'GoalIntent': function () {
      var speechOutput = goalMessage+" "+GetReprompt();
      var repromptOutput = GetReprompt();

        this.emit(':ask', speechOutput, repromptOutput);
    },

    'TipIntent': function () {
        var rand = tips[Math.floor(Math.random() * tips.length)];
        var speechOutput = rand+" "+GetReprompt();
        var repromptOutput = GetReprompt();
        this.emit(':ask', speechOutput, repromptOutput);
    },

    'PieceIntent': function () {
        // get value from slot
        if (this.event.request.intent.slots.Piece.value) {
        var slotValue = GetPiece(this.event.request.intent.slots.Piece.value);
      } else {
        var speechOutput = errorMessage+" " +pieceMessage;
        this.emit(':ask', speechOutput, speechOutput);
      }

        // initialize the output text to an error message
        var outputText = errorMessage;
        var cardTitle = "";
        var cardContent = "";
        var largeImage = "";
        var smallImage = "";

        // Using the slot value, search the list of piece objects and find the one where the key is the same as slot value.
        for (var i = 0; i < pieces.length; i++) {
            if (pieces[i].key == slotValue) {

                // When we have found the piece we are looking for,
                // set the output text to the value field of the found object.
                outputText = pieces[i].value;

                cardTitle = "The " + pieces[i].key;
                cardContent = pieces[i].value;

                // Set image URL
                smallImage = pieces[i].imageSmall;
                largeImage = pieces[i].imageLarge;
            }
        }
        // Create image object for home card
        var imageObj = {
            smallImageUrl: smallImage,
            largeImageUrl: largeImage
        };

        outputText = outputText + ", " + pieceMessage;
        this.emit(':askWithCard', outputText, GetReprompt(), cardTitle, cardContent, imageObj);
    }
}

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

// ====================== Helpers =======================================

// To handle different names of the pieces
function GetPiece(value) {
    //console.log("in GetPiece");
    switch (value.toLowerCase().trim()) {
        case "king":
            return "king";
        case "queen":
            return "queen";
        case "rook":
        case "rooks":
        case "tower":
        case "towers":
        case "castle":
        case "castles":
            return "rook";
        case "bishop":
        case "bishops":
            return "bishop";
        case "horse":
        case "horses":
        case "knight":
        case "knights":
            return "knight";
        default:
            return "pawn";
    }
}

// Picks a random repromt message from the array.
function GetReprompt() {
    //console.log("in GetReprompt");
    var rand = repromts[Math.floor(Math.random() * repromts.length)];
    return rand;
}
