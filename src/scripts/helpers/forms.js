import $ from 'jquery'

class FormValidator {
	constructor (form) {
		this.form = form
	}
	
	validate () {
		let isValid = true,
			inputs = this.form.find('input, select, textarea')
		inputs.each((index, input) => {
			let $input = $(input),
				$formGroup = $input.closest('.form-group')
			
			if ($input.is('[data-novalidate]')) {
				return
			}
			if (!input.value && input.required) {
				$formGroup.addClass('is-invalid')
				isValid = false
				return
			}
			
			if (input.value.length < input.minLength) {
				$formGroup.addClass('is-invalid')
				isValid = false
				return
			}
			$formGroup.removeClass('is-invalid')
		})
		
		if (!isValid) {
			let invalidElements = this.form.find('.is-invalid')
			$('html, body').animate({
				scrollTop: $(invalidElements[0]).offset().top
			}, 200)
		}
		
		return isValid
	}
}

export default FormValidator
