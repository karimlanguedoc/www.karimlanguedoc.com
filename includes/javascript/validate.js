/*
    jQuery Form Validation Plugin v1.1 by: Karim Languedoc 
    Contact me with questions, concerns or improvements 
    via email: karimlanguedoc_public@outlook.com, OR you 
    can follow and contribute to this project on GitHub: 
    http://www.github.com/klanguedoc

    USAGE:
        <form id='myForm'>
            <input type='text' id='name'/>
            // Other inputs here
        </form>
        <script>
            $('#myForm').submit(function (event){
                event.preventDefault();
                if (!$(this).validate())
                    return;
                    
                // Upon successful validation, do other things
            });
        </script>

        To override the default settings, simply pass an array to of
        options to the validate() method.  For instance
        var myOptions = {'default_Color' : '#333', 'status_RequiredField' : 'My Custom Error Message'};
        if (!$(this).validate())
            return;

        Passing custom checks to the plugin is very easy.  This is all done
        using JSON.  To accomplish this, we simply pass a new 'data-array' 
        attribute to our input.  For instance
        <input type='text' id='name' data-array='{"minLength":"6","maxLength":"8"}' />

        More options and checks are coming soon, so stay tuned!
*/

(function ($) {
    var errors = 0;
    var m_minimumLength = 0;
    var m_maximumLength = 0;

    $.fn.validate = function (options) {
        var settings = $.extend( {
          'default_Color'              : '#D8000C',
          'default_BottomMargin'       : '20px',
          'default_MinimumLength'      : '6',
          'default_MaximumLength'      : '30',
          'default_Float'              : 'left',
          'default_FontSize'           : '1em',
          'default_FontFamily'         : 'PlutoSansLight',
          'status_InvalidEmail'        : 'This Email Address Is Invalid',
          'status_RequiredField'       : 'This Field Is Required',
          'status_MinimumLength'       : 'Minimum Characters Required',
          'status_MaximumLength'       : 'Maximum Characters Required'
        }, options);

        var thisForm = $(this);
        if ($(".dynamicError"))
            $(".dynamicError").remove();
            
        if (typeof console == "undefined") {
            var console = {
                log: function () {}
            };
        }

        errors = 0;
        console.log("Validation start for form: " + $(this).id);

        $(thisForm).find(':input').each(function() {
            console.log("\tValidating input: " + this.id);
            console.log("\t\tInput Type: " + this.type);
            console.log("\t\tInput Value : " + this.value);
            
            if (!this.required){
                console.log("\t\tSkipping this input!");
                return;
            }
            
            var status, dynamicErrorDiv, skip = null;
            var inputError = 0;
            var optionalData = ($(this).attr("data-array")) ? $.parseJSON($(this).attr("data-array")) : null;
            if (optionalData != null) {
                if (optionalData.skip){
                    console.log("\t\tSkipping this input!");
                    return;
                }
                m_minimumLength = (optionalData.minLength) ? optionalData.minLength : settings['default_MinimumLength'];
                m_maximumLength = (optionalData.maxLength) ? optionalData.maxLength : settings['default_MaximumLength'];
            }

            switch(this.type) {
                case 'submit':
                case 'radio':
                    console.log("\t\tSkipping this input!");
                    break;
                case 'checkbox':
                case 'select-multiple':
                case 'select-one':
                case 'hidden':
                case 'text':
                case 'tel':
                case 'textarea':
                case 'password':
                case 'email':
                    if (this.type == "email"  &&  !emailAddressNotValid(this.value)) {
                        status = settings['status_InvalidEmail'];
                        inputError++;
                    }

                    if (optionalData != null) {
                        if (this.value.length < m_minimumLength) {
                            status = m_minimumLength + " " + settings['status_MinimumLength'];
                            inputError++;
                        } else if (this.value.length >= m_maximumLength) {
                            status = m_maximumLength + " " + settings['status_MaximumLength'];
                            inputError++;
                        }
                    }

                    if (this.required  &&  valueIsEmptyOrNull(this.value)) {
                        status = settings['status_RequiredField'];
                        inputError++;
                    }
                    break;
            }

            if (0 != inputError) {
                errors++;
                if (status == null)
                    return;
                    
                console.log("\t\tValidation status for this input: " + status);

                dynamicErrorDiv = "<span class='dynamicError' id='" + this.id + "_dynamicError'>";
                dynamicErrorDiv += status;
                dynamicErrorDiv += "</span>";

                $(this).css('margin-bottom', '3px');
                $(this).after(dynamicErrorDiv);
                $(thisForm).find("#" + this.id + "_dynamicError").css({
                    'width'          : $(this).width(),
                    'margin-bottom'  : settings['default_BottomMargin'],
                    'color'          : settings['default_Color'],
                    'float'          : settings['default_Float'],
                    'font-size'      : settings['default_FontSize'],
                    'font-family'    : settings['default_FontFamily']
                }).fadeIn();
            }else {
                $(thisForm).find("#" + this.id + "_dynamicError").fadeOut();
                $(this).css('margin-bottom', settings['default_BottomMargin']);
                if (0 != errors  &&  skip)
                    errors--;
            }
        });
        
        console.log("Validation ended: \nNumber of errors found: " + errors + "\n\n");
        
        if (0 != errors)
            return false;
        return true;
    }

    function emailAddressNotValid(emailAddress) {
        var regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,4}))$/;
        return regEx.test(emailAddress);
    }

    function valueIsEmptyOrNull(value) {
        var item = value.replace(/^\s+|\s+j/g, '');
        if (item != "" && item != null)
            return false;	
        return true;
    }
}) (jQuery);