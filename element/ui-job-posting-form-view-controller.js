//TODO:
//Change events to 'input'
//UI-JOB-POSTING-CARD
//Location issue
//JobBenefits is not array



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
		this.$baseSalary.addEventListener('input', e => { this._updateEvent(e)});

		this.$datePosted = this.shadowRoot.querySelector('#datePosted');
		this.$datePosted.addEventListener('input', e => { this._updateEvent(e)});

		this.$educationRequirements = this.shadowRoot.querySelector('#educationRequirements');
		this.$educationRequirements.addEventListener('change', e => { this._updateEvent(e)});

		this.$employmentType = this.shadowRoot.querySelector('#employmentType');
		this.$employmentType.addEventListener('input', e => { this._updateEvent(e)});

		this.$experienceRequirements = this.shadowRoot.querySelector('#experienceRequirements');
		this.$experienceRequirements.addEventListener('change', e => { this._updateEvent(e)});

		//START: Hiring Organization
		this.$hiringOrganizationName = this.shadowRoot.querySelector('#hiringOrganizationName');
		this.$hiringOrganizationName.addEventListener('input', e => {
			let value = this.hiringOrganization;
			value.name = e.target.value;
			this.hiringOrganization = value;
		});

		this.$hiringOrganizationAddress = this.shadowRoot.querySelector('#hiringOrganizationAddress');
		this.$hiringOrganizationAddress.addEventListener('update', e => {
			console.log('ADDRESS UPDATE')
			let value = this.hiringOrganization;
			value.address = e.target.value;
			this.hiringOrganization = value;
		});


		this.$hiringOrganizationDisambiguatingDescription = this.shadowRoot.querySelector('#hiringOrganizationDisambiguatingDescription');
		this.$hiringOrganizationDisambiguatingDescription.addEventListener('input', e => {
			let value = this.hiringOrganization;
			value.disambiguatingDescription = e.target.value;
			this.hiringOrganization = value;
		});

		this.$hiringOrganizationDescription = this.shadowRoot.querySelector('#hiringOrganizationDescription');
		this.$hiringOrganizationDescription.addEventListener('input', e => {
			let value = this.hiringOrganization;
			value.description = e.target.value;
			this.hiringOrganization = value;
		});

		//END: Hiring Organization
		this.$incentiveCompensation = this.shadowRoot.querySelector('#incentiveCompensation');
		this.$incentiveCompensation.addEventListener('input', e => { this._updateEvent(e)});

		this.$industry = this.shadowRoot.querySelector('#industry');
		this.$industry.addEventListener('input', e => { this._updateEvent(e)});

		this.$jobBenefits = this.shadowRoot.querySelector('#jobBenefits');
		this.$jobBenefits.addEventListener('change', e => { this._updateEvent(e)});

		this.$jobLocation = this.shadowRoot.querySelector('#jobLocation');
		this.$jobLocation.addEventListener('change', e => { this._updateEvent(e)});

		this.$occupationalCategory = this.shadowRoot.querySelector('#occupationalCategory');
		this.$occupationalCategory.addEventListener('input', e => { this._updateEvent(e)});

		this.$qualifications = this.shadowRoot.querySelector('#qualifications');
		this.$qualifications.addEventListener('change', e => { this._updateEvent(e)});

		this.$responsibilities = this.shadowRoot.querySelector('#responsibilities');
		this.$responsibilities.addEventListener('change', e => { this._updateEvent(e)});

		this.$salaryCurrency = this.shadowRoot.querySelector('#salaryCurrency');
		this.$salaryCurrency.addEventListener('input', e => { this._updateEvent(e)});

		this.$skills = this.shadowRoot.querySelector('#skills');
		this.$skills.addEventListener('change', e => { this._updateEvent(e)}, false);

		this.$specialCommitments = this.shadowRoot.querySelector('#specialCommitments');
		this.$specialCommitments.addEventListener('input', e => { this._updateEvent(e)});

		this.$title = this.shadowRoot.querySelector('#title');
		this.$title.addEventListener('input', e => { this._updateEvent(e)});

		this.$validThrough = this.shadowRoot.querySelector('#validThrough');
		this.$validThrough.addEventListener('input', e => { this._updateEvent(e)});

		this.$workHours = this.shadowRoot.querySelector('#workHours');
		this.$workHours.addEventListener('input', e => { this._updateEvent(e)});

		this.$description = this.shadowRoot.querySelector('#description');
		this.$description.addEventListener('input', e => { this._updateEvent(e)});

		this.$image = this.shadowRoot.querySelector('#image');
		this.$image.addEventListener('input', e => { this._updateEvent(e)});

		this.setDefaults();
		this.connected = true;
		this._updateRender();
	}

	setDefaults(){
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

		this.salaryCurrency = 'USD';
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

	_updateEvent(e){
		this.dispatchEvent(new CustomEvent(this.defaultEventName, {detail: this.value}))
	}

	_updateRender(){
		if(this.$baseSalary && this.baseSalary){ this.$baseSalary.value = this.baseSalary; }
		if(this.$datePosted && this.datePosted){ this.$datePosted.value = this.datePosted; }
		if(this.$employmentType && this.employmentType){ this.$employmentType.value = this.employmentType; }



		if(this.$industry && this.industry){ this.$industry.value = this.industry; }
		//?
		if(this.$jobLocation && this.jobLocation){ this.$jobLocation.value = this.jobLocation; }
		if(this.$occupationalCategory && this.occupationalCategory){ this.$occupationalCategory.value = this.occupationalCategory; }
		if(this.$salaryCurrency && this.salaryCurrency){ this.$salaryCurrency.value = this.salaryCurrency; }
		if(this.$specialCommitments && this.specialCommitments){ this.$specialCommitments.value = this.specialCommitments; }
		if(this.$title && this.title){ this.$title.value = this.title; }
		if(this.$validThrough && this.validThrough){ this.$validThrough.value = this.validThrough; }
		if(this.$workHours && this.workHours){ this.$workHours.value = this.workHours; }
		//THING
		if(this.$description && this.description){ this.$description.value = this.description; }
		if(this.$image && this.image){ this.$image.value = this.image; }


		//UI-ARRAY-INPUTS HANDLE THEIR OWN UPDATING
		//if(this.$educationRequirements && this.educationRequirements){ this.$educationRequirements.value = this.educationRequirements; }
		//if(this.$experienceRequirements && this.experienceRequirements){ this.$experienceRequirements.value = this.experienceRequirements; }
		//if(this.$incentiveCompensation && this.incentiveCompensation){ this.$incentiveCompensation.value = this.incentiveCompensation; }
		//if(this.$jobBenefits && this.jobBenefits){ this.$jobBenefits.value = this.jobBenefits; }
		//if(this.$qualifications && this.qualifications){ this.$qualifications.value = this.qualifications; }
		//if(this.$responsibilities && this.responsibilities){ this.$responsibilities.value = this.responsibilities; }
		//if(this.$skills && this.skills){ this.$skills.value = this.skills; }
		//if(this.$xxx && this.xxx){ this.$xxx.value = this.xxx; }
	}

	stringifiedModel(){
		let stringModel = JSON.stringify(JobPosting.assignedProperties(this.model));
		return stringModel;
	}

	get shadowRoot(){return this._shadowRoot;}
	set shadowRoot(value){ this._shadowRoot = value}

    //MASTER
	get value(){
		let value = {}
		value = JobPosting.assignedProperties(this.model)
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
		this.model.hiringOrganization = new Organization(value.hiringOrganization);
		this.model.hiringOrganization.address = new PostalAddress(this.model.hiringOrganization.address);
		//DO NOT UPDATE ATTRIBUTE HERE, OTHERWISE INFINITE LOOP HAPPENS
		this._updateRender();
		this._updateEvent();
	}

	get baseSalary(){return this.model.baseSalary;}
	set baseSalary(value){
		this.model.baseSalary = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get datePosted(){return this.model.datePosted;}
	set datePosted(value){
		this.model.datePosted = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get educationRequirements(){return this.model.educationRequirements;}
	set educationRequirements(value){
		this.model.educationRequirements = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get employmentType(){return this.model.employmentType;}
	set employmentType(value){
		this.model.employmentType = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get experienceRequirements(){return this.model.experienceRequirements;}
	set experienceRequirements(value){
		this.model.experienceRequirements = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get hiringOrganization(){
		let value = Organization.assignedProperties(this.model.hiringOrganization);
		if(this.model.hiringOrganization.address){
			value.address = PostalAddress.assignedProperties(this.model.hiringOrganization.address);
		}
		return value;
	}
	set hiringOrganization(value){
		this.model.hiringOrganization = new Organization(value);
		if(value.address){
			this.model.hiringOrganization.address = new PostalAddress(value.address);
		}
		this.setAttribute('value', JSON.stringify(this.value));
	}

	get incentiveCompensation(){return this.model.incentiveCompensation;}
	set incentiveCompensation(value){
		this.model.incentiveCompensation = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get industry(){return this.model.industry;}
	set industry(value){
		this.model.industry = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get jobBenefits(){return this.model.jobBenefits;}
	set jobBenefits(value){
		this.model.jobBenefits = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get jobLocation(){return this.model.jobLocation;}
	set jobLocation(value){
		this.model.jobLocation = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get occupationalCategory(){return this.model.occupationalCategory;}
	set occupationalCategory(value){
		this.model.occupationalCategory = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get qualifications(){return this.model.qualifications;}
	set qualifications(value){
		this.model.qualifications = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get responsibilities(){return this.model.responsibilities;}
	set responsibilities(value){
		this.model.responsibilities = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get salaryCurrency(){return this.model.salaryCurrency;}
	set salaryCurrency(value){
		this.model.salaryCurrency = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get skills(){return this.model.skills;}
	set skills(value){
		this.model.skills = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get specialCommitments(){return this.model.specialCommitments;}
	set specialCommitments(value){
		this.model.specialCommitments = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get title(){return this.model.title;}
	set title(value){
		this.model.title = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get validThrough(){return this.model.validThrough;}
	set validThrough(value){
		this.model.validThrough = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get workHours(){return this.model.workHours;}
	set workHours(value){
		this.model.workHours = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get additionalType(){return this.model.additionalType;}
	set additionalType(value){
		this.model.additionalType = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get alternateName(){return this.model.alternateName;}
	set alternateName(value){
		this.model.alternateName = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get description(){return this.model.description;}
	set description(value){
		this.model.description = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get disambiguatingDescription(){return this.model.disambiguatingDescription;}
	set disambiguatingDescription(value){
		this.model.disambiguatingDescription = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get identifier(){return this.model.identifier;}
	set identifier(value){
		this.model.identifier = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get image(){return this.model.image;}
	set image(value){
		this.model.image = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get mainEntityOfPage(){return this.model.mainEntityOfPage;}
	set mainEntityOfPage(value){
		this.model.mainEntityOfPage = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get name(){return this.model.name;}
	set name(value){
		this.model.name = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get potentialAction(){return this.model.potentialAction;}
	set potentialAction(value){
		this.model.potentialAction = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get sameAs(){return this.model.sameAs;}
	set sameAs(value){
		this.model.sameAs = value
		this.setAttribute('value', this.stringifiedModel());
	}

	get url(){return this.model.url;}
	set url(value){
		this.model.url = value
		this.setAttribute('value', this.stringifiedModel());
	}

	disconnectedCallback() {
		console.log('disconnected');
	}
}

window.customElements.define('ui-job-posting-form', UIJobPostingFormViewController);
