class Contact extends Spine.Model
	@configure "Contact" , "first_name" , "last_name"
	validate : ->
		unless @first_name
			console.log "First name is required"

Contact.bind "create" , (newRecord)->
	console.log "New record was create"
	


contact = new Contact({first_name :"Joe"})
contact.save()