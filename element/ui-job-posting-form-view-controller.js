//TODO:
//Input array last input not added unless click add
//Place instead of address for jobLocation
//Location issue (after setting input array)
//

'use strict'
const uiJobPostingFormDocument = document._currentScript || document.currentScript;;
const uiJobPostingFormTemplate = uiJobPostingFormDocument.ownerDocument.querySelector('#ui-job-posting-form-view');

class UIJobPostingFormViewController extends HTMLElement{

	static get observedAttributes() { return ["value"]; }

	constructor(model){
		super();
		this.model = new JobPosting(model);
		const view = document.importNode(uiJobPostingFormTemplate.content, true);
		this.shadowRoot = this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(view);
		this.defaultEventName = 'update';
		this.connected = false;
	}

	///STANDARD
	connectedCallback() {
		this.$baseSalary = this.shadowRoot.querySelector('#baseSalary');
		this.$baseSalary.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$datePosted = this.shadowRoot.querySelector('#datePosted');
		this.$datePosted.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$educationRequirements = this.shadowRoot.querySelector('#educationRequirements');
		this.$educationRequirements.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		this.$employmentType = this.shadowRoot.querySelector('#employmentType');
		this.$employmentType.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$experienceRequirements = this.shadowRoot.querySelector('#experienceRequirements');
		this.$experienceRequirements.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		//START: Hiring Organization
		this.$hiringOrganizationName = this.shadowRoot.querySelector('#hiringOrganizationName');
		this.$hiringOrganizationName.addEventListener('input', e => { this._updateOrganization(e) }, false);

		this.$hiringOrganizationAddress = this.shadowRoot.querySelector('#hiringOrganizationAddress');
		this.$hiringOrganizationAddress.addEventListener('update', e => { this._updateAddressInputs(e) }, false);

		this.$hiringOrganizationDisambiguatingDescription = this.shadowRoot.querySelector('#hiringOrganizationDisambiguatingDescription');
		this.$hiringOrganizationDisambiguatingDescription.addEventListener('input', e => { this._updateOrganization(e) }, false);

		this.$hiringOrganizationDescription = this.shadowRoot.querySelector('#hiringOrganizationDescription');
		this.$hiringOrganizationDescription.addEventListener('input', e => { this._updateOrganization(e) }, false);
		//END: Hiring Organization

		this.$incentiveCompensation = this.shadowRoot.querySelector('#incentiveCompensation');
		this.$incentiveCompensation.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		this.$industry = this.shadowRoot.querySelector('#industry');
		this.$industry.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$jobBenefits = this.shadowRoot.querySelector('#jobBenefits');
		this.$jobBenefits.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		this.$jobLocation = this.shadowRoot.querySelector('#jobLocation');
		this.$jobLocation.addEventListener('update', e => { this._updateAddressInputs(e)});

		this.$occupationalCategory = this.shadowRoot.querySelector('#occupationalCategory');
		this.$occupationalCategory.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$qualifications = this.shadowRoot.querySelector('#qualifications');
		this.$qualifications.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		this.$responsibilities = this.shadowRoot.querySelector('#responsibilities');
		this.$responsibilities.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		this.$salaryCurrency = this.shadowRoot.querySelector('#salaryCurrency');
		this.$salaryCurrency.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$skills = this.shadowRoot.querySelector('#skills');
		this.$skills.addEventListener('update', e => { this._updateArrayInputs(e)}, false);

		this.$specialCommitments = this.shadowRoot.querySelector('#specialCommitments');
		this.$specialCommitments.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$title = this.shadowRoot.querySelector('#title');
		this.$title.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$validThrough = this.shadowRoot.querySelector('#validThrough');
		this.$validThrough.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$workHours = this.shadowRoot.querySelector('#workHours');
		this.$workHours.addEventListener('input', e => { this._updateBasicInputs(e)});
		this.$workHours.addEventListener('blur', e => { this._updateBasicInputs(e)});

		this.$description = this.shadowRoot.querySelector('#description');
		this.$description.addEventListener('input', e => { this._updateBasicInputs(e)});

		this.$hiringOrganizationLogo = this.shadowRoot.querySelector('#hiringOrganizationLogo');
		this.$hiringOrganizationLogo.addEventListener('update', e => { this._updateOrganization(e) });

		//this.$image = this.shadowRoot.querySelector('#image');
		//this.$image.addEventListener('update', e => { console.log('UI-IMAGE-INPUT SRC', e.detail) });

		//UI
		this.$hiringOrganizationContainer = this.shadowRoot.querySelector('#hiringOrganizationContainer');
		this.$jobPostingContainer = this.shadowRoot.querySelector('#jobPostingContainer');

		this.$nextButton = this.shadowRoot.querySelector('#nextButton');
		this.$nextButton.addEventListener('click', e => {
			this.$hiringOrganizationContainer.hidden = true;
			this.$jobPostingContainer.hidden = false;
		})

		this.$backButton = this.shadowRoot.querySelector('.back-button');
		this.$backButton.addEventListener('click', e => {
			this.$hiringOrganizationContainer.hidden = false;
			this.$jobPostingContainer.hidden = true;
		})

		this.$finishButton = this.shadowRoot.querySelector('#finishButton');
		this.$finishButton.addEventListener('click', e => {
			this._finishEvent();
		})

		this.setDefaults();
		this.connected = true;
	}

	setDefaults(){
		this.salaryCurrency = 'USD';
		//DEFAULT POSTING DATE
		let date = new Date();
		let year = `${ date.getUTCFullYear() }`;
		let month = `${ date.getMonth()+1 < 10? "0"+date.getMonth() : date.getMonth() }`;
		let day = `${ date.getDate() < 10? "0"+date.getDate() : date.getDate() }`;
		let today = `${year}-${month}-${day}`;
		this.datePosted = today;

		//Valid Through
		let unixTime = Date.now();
		unixTime += 1000 * 60 * 60 * 24 * 30;
		date = new Date(unixTime);
		year = `${ date.getUTCFullYear() }`;
		month = `${ date.getMonth()+1 < 10? "0"+date.getMonth() : date.getMonth() }`;
		day = `${ date.getDate() < 10? "0"+date.getDate() : date.getDate() }`;
		let expires = `${year}-${month}-${day}`;
		this.validThrough = expires;
	}

	//Parse and pass attribute to property (property as source of truth);
	attributeChangedCallback(attrName, oldVal, newVal) {
		switch(attrName){
			case 'value':
				this.value = JSON.parse(newVal);
				break;
			default:
				console.warn(`Attribute ${attrName} is not handled. Try changing 'value' attrubute instead`);
		}
	}

	_updateBasicInputs(e){
		this[e.target.id] = e.target.value;
	}

	_updateArrayInputs(e){
		console.log('UPDATE ARRAY', e.target.id, e.detail.string);
		this[e.target.id] = e.detail.string;
	}

	_updateAddressInputs(e){
		switch(e.target.id){
			case 'hiringOrganizationAddress':
				let value = this.hiringOrganization;
				value.address = e.detail;
				this.hiringOrganization = value;
				break;
			case 'jobLocation':
				this.jobLocation = e.detail;
				break;
			default:
				console.warn(`Target element id: '${e.target.id}' is not handled`);
		}
	}

	_updateOrganization(e){
		let value = this.hiringOrganization;

		switch(e.target.id){
			case 'hiringOrganizationName':
				value.name = e.target.value;
				break;
			case 'hiringOrganizationDisambiguatingDescription':
				value.disambiguatingDescription = e.target.value;
				break;
			case 'hiringOrganizationDescription':
				value.description = e.target.value;
				break;
			case 'hiringOrganizationLogo':
				value.image = e.detail;
				break;
			default:
				console.warn(`Target element id: '${e.target.id}' is not handled`);
		}
		this.hiringOrganization = value;
	}

	_updateAttribute(){
		this.setAttribute('value', JSON.stringify(this.value));
	}

	_finishEvent(e){
		this.dispatchEvent(new CustomEvent('finish', {detail: this.value}))
	}


	_updateEvent(e){
		this.dispatchEvent(new CustomEvent('update', {detail: this.value}))
	}

	_updateRender(){ }

	get shadowRoot(){return this._shadowRoot;}
	set shadowRoot(value){ this._shadowRoot = value}



	//MASTER
	get value(){
		let value = JobPosting.assignedProperties(this.model)
		if(value.hiringOrganization){
			value.hiringOrganization = Organization.assignedProperties(this.model.hiringOrganization)
			if(value.hiringOrganization.address){
				value.hiringOrganization.address = PostalAddress.assignedProperties(this.model.hiringOrganization.address)
			}
		}
		return value;
	}
	set value(value){
		this.model = new JobPosting(value);
		if(value.hiringOrganization){
			this.model.hiringOrganization = new Organization(value.hiringOrganization);
			if(value.hiringOrganization.address){
				this.model.hiringOrganization.address = new PostalAddress(this.model.hiringOrganization.address);
			}
		}
		//DO NOT UPDATE ATTRIBUTE HERE, OTHERWISE INFINITE LOOP HAPPENS
		this._updateEvent();
	}

	get baseSalary(){return this.model.baseSalary;}
	set baseSalary(value){
		this.model.baseSalary = value === ''? ' ': value;
		this._updateAttribute();
	}

	get datePosted(){return this.model.datePosted;}
	set datePosted(value){
		this.model.datePosted = value
		this._updateAttribute();
	}

	get educationRequirements(){return this.model.educationRequirements;}
	set educationRequirements(value){
		this.model.educationRequirements = value
		this._updateAttribute();
	}

	get employmentType(){return this.model.employmentType;}
	set employmentType(value){
		this.model.employmentType = value
		this._updateAttribute();
	}

	get experienceRequirements(){return this.model.experienceRequirements;}
	set experienceRequirements(value){
		this.model.experienceRequirements = value
		this._updateAttribute();
	}

	//THIS IS PROB WHERE THE ISSUE IS
	get hiringOrganization(){
		let model = JobPosting.assignedProperties(this.model);
		if(model.hiringOrganization){
			model = Organization.assignedProperties(model.hiringOrganization);
			if(model.address){
				model.address = PostalAddress.assignedProperties(model.address);
			}
		}
		return model;
	}

	set hiringOrganization(value){
		this.model.hiringOrganization = new Organization(value);
		if(value.address){ this.model.hiringOrganization.address = new PostalAddress(value.address); }
		this._updateAttribute();
	}

	get incentiveCompensation(){return this.model.incentiveCompensation;}
	set incentiveCompensation(value){
		this.model.incentiveCompensation = value
		this._updateAttribute();
	}

	get industry(){return this.model.industry;}
	set industry(value){
		this.model.industry = value === ''? ' ': value;
		this._updateAttribute();
	}

	get jobBenefits(){return this.model.jobBenefits;}
	set jobBenefits(value){
		this.model.jobBenefits = value
		this._updateAttribute();
	}

	get jobLocation(){return this.model.jobLocation;}
	set jobLocation(value){
		this.model.jobLocation = value
		this._updateAttribute();
	}

	get occupationalCategory(){return this.model.occupationalCategory;}
	set occupationalCategory(value){
		this.model.occupationalCategory = value === ''? ' ': value;
		this._updateAttribute();
	}

	get qualifications(){return this.model.qualifications;}
	set qualifications(value){
		this.model.qualifications = value
		this._updateAttribute();
	}

	get responsibilities(){return this.model.responsibilities;}
	set responsibilities(value){
		this.model.responsibilities = value
		this._updateAttribute();
	}

	get salaryCurrency(){return this.model.salaryCurrency;}
	set salaryCurrency(value){
		this.model.salaryCurrency = value === ''? ' ': value;
		this._updateAttribute();
	}

	get skills(){return this.model.skills;}
	set skills(value){
		console.log('UPDATING SKILLS', value)
		this.model.skills = value
		this._updateAttribute();
	}

	get specialCommitments(){return this.model.specialCommitments;}
	set specialCommitments(value){
		this.model.specialCommitments = value === ''? ' ': value;
		this._updateAttribute();
	}

	get title(){return this.model.title;}
	set title(value){
		this.model.title = value === ''? ' ': value;
		this._updateAttribute();
	}

	get validThrough(){return this.model.validThrough;}
	set validThrough(value){
		this.model.validThrough = value
		this._updateAttribute();
	}

	get workHours(){return this.model.workHours;}
	set workHours(value){
		this.model.workHours = value === ''? ' ': value;
		this._updateAttribute();
	}

	get additionalType(){return this.model.additionalType;}
	set additionalType(value){
		this.model.additionalType = value === ''? ' ': value;
		this._updateAttribute();
	}

	get alternateName(){return this.model.alternateName;}
	set alternateName(value){
		this.model.alternateName = value === ''? ' ': value;
		this._updateAttribute();
	}

	get description(){return this.model.description;}
	set description(value){
		this.model.description = value === ''? ' ': value;
		this._updateAttribute();
	}

	get disambiguatingDescription(){return this.model.disambiguatingDescription;}
	set disambiguatingDescription(value){
		this.model.disambiguatingDescription = value === ''? ' ': value;
		this._updateAttribute();
	}

	get identifier(){return this.model.identifier;}
	set identifier(value){
		this.model.identifier = value === ''? ' ': value;
		this._updateAttribute();
	}

	get image(){return this.model.image;}
	set image(value){
		this.model.image = value
		this._updateAttribute();
	}

	get mainEntityOfPage(){return this.model.mainEntityOfPage;}
	set mainEntityOfPage(value){
		this.model.mainEntityOfPage = value
		this._updateAttribute();
	}

	get name(){return this.model.name;}
	set name(value){
		this.model.name = value
		this._updateAttribute();
	}

	get potentialAction(){return this.model.potentialAction;}
	set potentialAction(value){
		this.model.potentialAction = value
		this._updateAttribute();
	}

	get sameAs(){return this.model.sameAs;}
	set sameAs(value){
		this.model.sameAs = value
		this._updateAttribute();
	}

	get url(){return this.model.url;}
	set url(value){
		this.model.url = value
		this.setAttribute('value', this.stringifiedModel());
		this._updateAttribute();
	}

	disconnectedCallback() {
		console.log('disconnected');
	}
}

window.customElements.define('ui-job-posting-form', UIJobPostingFormViewController);
