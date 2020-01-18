var message = document.querySelector('#message');

        var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
        var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;

        var grammar = '#JSGF V1.0;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();

        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.continuous = true;

        recognition.onresult = function(event) {
            var last = event.results.length - 1;
            var command = event.results[last][0].transcript;
            message.textContent += command + ".";
        };

        document.querySelector('#btn-stop-recording').addEventListener('click', function(){
            recognition.stop();
            document.querySelector('#btn-check').disabled = false;
        });

        recognition.onerror = function(event) {
            message.textContent = 'Error occurred in recognition: ' + event.error;
        }        

        document.querySelector('#btn-start-recording').addEventListener('click', function(){
            recognition.start();
        });

        $(document).ready(function() {

            var urlGrammarCheck = "https://api.textgears.com/check.php";
            $('#btn-check').click(function(){
                this.disabled = true;
                $.ajax({
                    url: urlGrammarCheck,
                    data: {
                        text: message.textContent.slice(15),
                        key: 'wTZGURy3SHOYjHyR'
                    },
                    type: 'POST',
                    success: function(result) {
                        var initialMessage = document.getElementById('message').textContent;
                        var finalMessage = '';
                        var prev = 0;
                        document.getElementById('message').style.display = 'block';
                        result.errors.forEach(error => {
                            const change = error.offset + error.length;
                            const suggestion = error.better[0];
                            finalMessage += initialMessage.slice(prev, error.offset)
                        });
                    },
                    error: function(errors) {
                        console.log(error);
                    }
                })
            })
        })