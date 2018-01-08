<template>
    <form @submit.prevent="submit">
        <div class="alert alert-danger"
                 v-if="showMessage">
            {{ message }}
        </div>
        <div class="alert alert-success"
             v-if="submitted">
            {{ successMessage }}
        </div>
        <slot :hasError="hasError"
              :errorState="errorState"
              :error="error"/>
        <div class="form-group mt-3">
            <button class="btn btn-primary" type="submit"
                   :disabled="submitting">{{ submitLabel }}
            </button>
        </div>
    </form>
</template>

<script>
    import axios from "axios"

    export default {
        props: {
            /**
             * The form submit method.
             */
            method: {
                default: "POST",
                type: String
            },
            /**
             * The URL to submit the form to.
             */
            action: {
                required: true,
                type: String
            },
            /**
             * The payload model. Will be used as the payload for submission.
             */
            model: {
                default()
                {
                    return {}
                },
                type: Object
            },
            /**
             * The message to show the user on submission.
             */
            successMessage: {
                default()
                {
                    return "Success!"
                },
                type: String
            },
            /**
             * The submit button label
             */
            submitLabel: {
                default()
                {
                    return "Submit"
                    type: String
                }
            },
            /**
             * A custom validation function.
             */
            validate: {
                default()
                {
                    return function () {
                        return true
                    }
                }
            }
        },
        data()
        {
            return {
                message: "", //An error message for the entire form.
                errors: [], //An {field name: error message} map of errors.
                submitting: false, //Is the form being submitted
                submitted: false //Has the form been submitted
            }
        },
        computed: {
            /**
             * Does the form have an error message?
             * @returns {boolean}
             */
            hasMessage()
            {
                return !!this.message
            }
        },
        methods: {
            /**
             * Perform any custom validation and then attempt to submit the form.
             *
             * @returns {Promise<void>}
             */
            async submit()
            {
                this.submitted = false
                this.errors = {}
                this.message = ""

                //Perform custom validation
                let customValidation = this.validate()
                if (customValidation !== true) {
                    this.handleErrorResponse(customValidation)
                    return
                }

                //Start the submission process
                this.submitting = true

                let requestConfig = {
                    url: this.action,
                    method: this.method,
                    data: this.model
                }

                try {
                    let {data: result} = await axios(requestConfig)
                    this.handleSuccess(result)
                } catch ({response, message}) {
                    this.submitted = false
                    if (response.status === 422) {
                        this.handleValidationErrorResponse(response)
                    } else {
                        this.handleErrorResponse()
                    }
                } finally {
                    this.submitting = false
                }
            },

            /**
             * The was a 422 error
             * @param data
             */
            handleValidationErrorResponse({data})
            {
                this.errors = data.errors
                this.$emit("invalid", data)

                this.handleErrorResponse(data.message)
            },

            /**
             * The submission failed
             * @param message
             */
            handleErrorResponse(message = "Submission Failed")
            {
                this.message = message
                this.$emit("error", message)

                scroll(0, 0)
            },

            /**
             * The request was successful
             * @param result
             */
            handleSuccess(result)
            {
                this.$emit("submitted", result)
                this.submitted = true
                scroll(0, 0)
            },

            /**
             * Is there an error for a field key?
             * @param key
             * @returns {boolean}
             */
            hasError(key)
            {
                return this.errors[key] ? true : false
            },

            /**
             * Get the error state for a field key.
             * @param key
             * @returns {*}
             */
            errorState(key)
            {
                if (this.hasError(key)) {
                    return "invalid"
                }
                return null
            },

            /**
             * Get an error for a field key.
             * @param key
             * @returns {*}
             */
            error(key)
            {
                if (this.hasError(key)) {
                    return this.errors[key][0]
                }
                return undefined
            }
        }
    }
</script>