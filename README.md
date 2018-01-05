# Bootstrap-Vue Laravel Form

> A form component built with bootstrap-vue that works with Laravel validation.

## Example use
```js
    import VForm from 'bootstrap-vue-laravel-form'
    
    export default {
        components: {VForm},
        data()
        {
            return {
                input: {
                    name: null,
                    message: null
                }
            }
        },
        methods: {
            handleSubmitted()
            {
                alert('woot!')
            }
        }
    }
```

```html
    <v-form
        :model="input"
        action="/submit/url"
        method="PUT"
        @submitted="handleSubmitted">
        <template scope="{ error, errorState }">
             <b-form-input 
                v-model="name"
                :state="errorState('name')"
                :error="error('name')"
            />
            <b-form-textarea 
                v-model="message"
                :state="errorState('message')"
                :error="error('message')"
            />
        </template>
    </v-form>
```

## Props

| Name | Default | Required | Description |
| ---- |----| ----| -----|
| method | POST | | The form submit method. |
| action | | required | The URL to submit the form to |
| model | {} | | The payload model. Will be used as the payload for submission. |
| success-message | Success! | | The message to show the user on submission. |
| success-label | Submit | | The submit button label |
| validate | | | A custom validation function. |

## Events

| Name | Provides |
| ---- |---- |
| invalid | errors |
| error | message |
| submitted | response |

## Validation scopes

| Name | Description |
| ---- |---- |
| error | The error message for a field key |
| errorState | 'invalid' if there is an error, null if there is no error |
| submitted | response |