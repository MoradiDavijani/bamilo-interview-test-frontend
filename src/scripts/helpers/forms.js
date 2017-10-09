import $ from 'jquery'

class FormValidator {
	constructor (form) {
		this.form = form
	}
	
	validate () {
		let isValid = true,
			inputs = this.form.find('input')
		inputs.each((index, input) => {
			let $input = $(input)
			if (!input.value && input.required) {
				$input.addClass('is-invalid')
				isValid = false
				return
			}
			
			if (input.value.length < input.minLength) {
				$input.addClass('is-invalid')
				isValid = false
				return
			}
			$input.removeClass('is-invalid')
		})
		return isValid
	}
}

export default FormValidator
