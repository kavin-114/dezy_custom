frappe.pages['material-request-cus'].on_page_load = function(wrapper) {
	frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Material Request',
		single_column: true
	});
	wrapper.pos = new Controller(wrapper);
	window.cur_mr = wrapper.pos;
};
// frappe.pages['material-request-cus'].refresh = function(wrapper) {
// 	// if (document.scannerDetectionData) {
// 	// 	onScan.detachFrom(document);
// 	// 	wrapper.pos.wrapper.html("");
// 	// 	wrapper.pos.check_opening_entry();
// 	// }
// 	window.cur_page = wrapper.pos

// };
class Controller {
	constructor(wrapper) {
		this.wrapper = $(wrapper).find('.layout-main-section');
		this.page = wrapper.page;
		this.init_settings();

	}
	allow_negative_stock() {
		frappe.db.get_value('Stock Settings', undefined, 'allow_negative_stock').then(({ message }) => {
			this.allow_negative_stock = flt(message.allow_negative_stock) || false;
		});
	}
	init_settings() {
		this.item_stock_map = {};
		this.settings = {};
		this.allow_negative_stock();
		this.make_app();

		// frappe.call({
		// 	method: "erpnext.selling.page.point_of_sale.point_of_sale.get_pos_profile_data",
		// 	args: { "pos_profile": this.pos_profile },
		// 	callback: (res) => {
		// 		const profile = res.message;
		// 		Object.assign(this.settings, profile);
		// 		this.settings.customer_groups = profile.customer_groups.map(group => group.name);
		// 		this.make_app();
		// 	}
		// });
	}
	// fetch_opening_entry() {
	// 	return frappe.call("erpnext.selling.page.point_of_sale.point_of_sale.check_opening_entry", { "user": frappe.session.user });
	// }

	// check_opening_entry() {
	// 	this.fetch_opening_entry().then((r) => {
	// 		if (r.message.length) {
	// 			// assuming only one opening voucher is available for the current user
	// 			this.prepare_app_defaults(r.message[0]);
	// 		} else {
	// 			this.create_opening_voucher();
	// 		}
	// 	});
	// }

	// create_opening_voucher() {
	// 	const me = this;
	// 	const table_fields = [
	// 		{
	// 			fieldname: "mode_of_payment", fieldtype: "Link",
	// 			in_list_view: 1, label: "Mode of Payment",
	// 			options: "Mode of Payment", reqd: 1
	// 		},
	// 		{
	// 			fieldname: "opening_amount", fieldtype: "Currency",
	// 			in_list_view: 1, label: "Opening Amount",
	// 			options: "company:company_currency",
	// 			change: function () {
	// 				dialog.fields_dict.balance_details.df.data.some(d => {
	// 					if (d.idx == this.doc.idx) {
	// 						d.opening_amount = this.value;
	// 						dialog.fields_dict.balance_details.grid.refresh();
	// 						return true;
	// 					}
	// 				});
	// 			}
	// 		}
	// 	];
	// 	const fetch_pos_payment_methods = () => {
	// 		const pos_profile = dialog.fields_dict.pos_profile.get_value();
	// 		if (!pos_profile) return;
	// 		frappe.db.get_doc("POS Profile", pos_profile).then(({ payments }) => {
	// 			dialog.fields_dict.balance_details.df.data = [];
	// 			payments.forEach(pay => {
	// 				const { mode_of_payment } = pay;
	// 				dialog.fields_dict.balance_details.df.data.push({ mode_of_payment, opening_amount: '0' });
	// 			});
	// 			dialog.fields_dict.balance_details.grid.refresh();
	// 		});
	// 	}
	// 	const dialog = new frappe.ui.Dialog({
	// 		title: __('Create POS Opening Entry'),
	// 		static: true,
	// 		fields: [
	// 			{
	// 				fieldtype: 'Link', label: __('Company'), default: frappe.defaults.get_default('company'),
	// 				options: 'Company', fieldname: 'company', reqd: 1
	// 			},
	// 			{
	// 				fieldtype: 'Link', label: __('POS Profile'),
	// 				options: 'POS Profile', fieldname: 'pos_profile', reqd: 1,
	// 				get_query: () => pos_profile_query(),
	// 				onchange: () => fetch_pos_payment_methods()
	// 			},
	// 			{
	// 				fieldname: "balance_details",
	// 				fieldtype: "Table",
	// 				label: "Opening Balance Details",
	// 				cannot_add_rows: false,
	// 				in_place_edit: true,
	// 				reqd: 1,
	// 				data: [],
	// 				fields: table_fields
	// 			}
	// 		],
	// 		primary_action: async function({ company, pos_profile, balance_details }) {
	// 			if (!balance_details.length) {
	// 				frappe.show_alert({
	// 					message: __("Please add Mode of payments and opening balance details."),
	// 					indicator: 'red'
	// 				})
	// 				return frappe.utils.play_sound("error");
	// 			}

	// 			// filter balance details for empty rows
	// 			balance_details = balance_details.filter(d => d.mode_of_payment);

	// 			const method = "erpnext.selling.page.point_of_sale.point_of_sale.create_opening_voucher";
	// 			const res = await frappe.call({ method, args: { pos_profile, company, balance_details }, freeze:true });
	// 			!res.exc && me.prepare_app_defaults(res.message);
	// 			dialog.hide();
	// 		},
	// 		primary_action_label: __('Submit')
	// 	});
	// 	dialog.show();
	// 	const pos_profile_query = () => {
	// 		return {
	// 			query: 'erpnext.accounts.doctype.pos_profile.pos_profile.pos_profile_query',
	// 			filters: { company: dialog.fields_dict.company.get_value() }
	// 		}
	// 	};
	// }

	// async prepare_app_defaults(data) {
	// 	this.pos_opening = data.name;
	// 	this.company = data.company;
	// 	this.pos_profile = data.pos_profile;
	// 	this.pos_opening_time = data.period_start_date;




	// set_opening_entry_status() {
	// 	this.page.set_title_sub(
	// 		`<span class="indicator orange">
	// 			<a class="text-muted" href="#Form/POS%20Opening%20Entry/${this.pos_opening}">
	// 				Opened at ${moment(this.pos_opening_time).format("Do MMMM, h:mma")}
	// 			</a>
	// 		</span>`);
	// }

	make_app() {
		this.prepare_dom();
		this.prepare_components();
		this.make_material_request_frm()
		this.prepare_menu();
		// this.make_new_invoice();
	}

	prepare_dom() {
		this.wrapper.append(
			`
			<div class = "fields-section"></div>
			<div class="point-of-sale-app"></div>`
		);
		this.$fields_component = this.wrapper.find('.fields-section')
		this.$components_wrapper = this.wrapper.find('.point-of-sale-app');
	}

	prepare_components() {
		this.init_item_selector();
		this.init_item_details();
		this.init_item_cart();
		// this.init_payments();
		// this.init_recent_order_list();
		// this.init_order_summary();
	}

	prepare_menu() {
		this.page.clear_menu();

		this.page.add_menu_item(__("Open Form View"), this.open_form_view.bind(this), false, 'Ctrl+F');

		// this.page.add_menu_item(__("Toggle Recent Orders"), this.toggle_recent_order.bind(this), false, 'Ctrl+O');

		// this.page.add_menu_item(__("Save as Draft"), this.save_draft_invoice.bind(this), false, 'Ctrl+S');

		// this.page.add_menu_item(__('Close the POS'), this.close_pos.bind(this), false, 'Shift+Ctrl+C');
	}

	open_form_view() {
		frappe.model.sync(this.frm.doc);
		frappe.set_route("Form", this.frm.doc.doctype, this.frm.doc.name);
	}

	toggle_recent_order() {
		const show = this.recent_order_list.$component.is(':hidden');
		this.toggle_recent_order_list(show);
	}

	save_draft_invoice() {
		if (!this.$components_wrapper.is(":visible")) return;

		if (this.frm.doc.items.length == 0) {
			frappe.show_alert({
				message: __("You must add atleast one item to save it as draft."),
				indicator:'red'
			});
			frappe.utils.play_sound("error");
			return;
		}

		this.frm.save(undefined, undefined, undefined, () => {
			frappe.show_alert({
				message: __("There was an error saving the document."),
				indicator: 'red'
			});
			frappe.utils.play_sound("error");
		}).then(() => {
			frappe.run_serially([
				() => frappe.dom.freeze(),
				() => this.make_new_invoice(),
				() => frappe.dom.unfreeze(),
			]);
		});
	}

	// close_pos() {
	// 	if (!this.$components_wrapper.is(":visible")) return;

	// 	let voucher = frappe.model.get_new_doc('POS Closing Entry');
	// 	voucher.pos_profile = this.frm.doc.pos_profile;
	// 	voucher.user = frappe.session.user;
	// 	voucher.company = this.frm.doc.company;
	// 	voucher.pos_opening_entry = this.pos_opening;
	// 	voucher.period_end_date = frappe.datetime.now_datetime();
	// 	voucher.posting_date = frappe.datetime.now_date();
	// 	frappe.set_route('Form', 'POS Closing Entry', voucher.name);
	// }

	init_item_selector() {
		this.item_selector = new ItemSelector({
			wrapper: this.$components_wrapper,
			field_wrapper:this.$fields_component,
			settings: this.settings,
			events: {
				item_selected: args => this.on_cart_update(args),

				get_frm: () => this.frm || {}
			}
		})
	}

	init_item_cart() {
		this.cart = new ItemCart({
			wrapper: this.$components_wrapper,
			settings: this.settings,
			events: {
				get_frm: () => this.frm,

				cart_item_clicked: (item) => {
					const item_row = this.get_item_from_frm(item);
					this.item_details.toggle_item_details_section(item_row);
				},

				numpad_event: (value, action) => this.update_item_field(value, action),

				checkout: () => this.save_and_checkout(),

				edit_cart: () => this.payment.edit_cart(),

				customer_details_updated: (details) => {
					this.customer_details = details;
					// will add/remove LP payment method
					this.payment.render_loyalty_points_payment_mode();
				}
			}
		})
	}

	init_item_details() {
		this.item_details = new ItemDetails({
			wrapper: this.$components_wrapper,
			settings: this.settings,
			events: {
				get_frm: () => this.frm,

				toggle_item_selector: (minimize) => {
					this.item_selector.resize_selector(minimize);
					this.cart.toggle_numpad(minimize);
				},

				form_updated: (item, field, value) => {
					const item_row = frappe.model.get_doc(item.doctype, item.name);
					console.log("Form Updated : ",item,field, value);
					if (item_row && item_row[field] != value) {
						const args = {
							field,
							value,
							item: item
						};
						return this.on_cart_update(args);
					}

					return Promise.resolve();
				},

				highlight_cart_item: (item) => {
					const cart_item = this.cart.get_cart_item(item);
					this.cart.toggle_item_highlight(cart_item);
				},

				item_field_focused: (fieldname) => {
					this.cart.toggle_numpad_field_edit(fieldname);
				},
				set_value_in_current_cart_item: (selector, value) => {
					this.cart.update_selector_value_in_cart_item(selector, value, this.item_details.current_item);
				},
				clone_new_batch_item_in_frm: (batch_serial_map, item) => {
					// called if serial nos are 'auto_selected' and if those serial nos belongs to multiple batches
					// for each unique batch new item row is added in the form & cart
					Object.keys(batch_serial_map).forEach(batch => {
						const item_to_clone = this.frm.doc.items.find(i => i.name == item.name);
						const new_row = this.frm.add_child("items", { ...item_to_clone });
						// update new serialno and batch
						new_row.batch_no = batch;
						new_row.serial_no = batch_serial_map[batch].join(`\n`);
						new_row.qty = batch_serial_map[batch].length;
						this.frm.doc.items.forEach(row => {
							if (item.item_code === row.item_code) {
								this.update_cart_html(row);
							}
						});
					})
				},
				remove_item_from_cart: () => this.remove_item_from_cart(),
				get_item_stock_map: () => this.item_stock_map,
				close_item_details: () => {
					this.item_details.toggle_item_details_section(null);
					this.cart.prev_action = null;
					this.cart.toggle_item_highlight();
				},
				get_available_stock: (item_code, warehouse) => this.get_available_stock(item_code, warehouse)
			}
		});
	}

	init_payments() {
		this.payment = new erpnext.PointOfSale.Payment({
			wrapper: this.$components_wrapper,
			events: {
				get_frm: () => this.frm || {},

				get_customer_details: () => this.customer_details || {},

				toggle_other_sections: (show) => {
					if (show) {
						this.item_details.$component.is(':visible') ? this.item_details.$component.css('display', 'none') : '';
						this.item_selector.toggle_component(false);
					} else {
						this.item_selector.toggle_component(true);
					}
				},

				submit_invoice: () => {
					this.frm.savesubmit()
						.then((r) => {
							this.toggle_components(false);
							this.order_summary.toggle_component(true);
							this.order_summary.load_summary_of(this.frm.doc, true);
							frappe.show_alert({
								indicator: 'green',
								message: __('POS invoice {0} created succesfully', [r.doc.name])
							});
						});
				}
			}
		});
	}

	init_recent_order_list() {
		this.recent_order_list = new erpnext.PointOfSale.PastOrderList({
			wrapper: this.$components_wrapper,
			events: {
				open_invoice_data: (name) => {
					frappe.db.get_doc('POS Invoice', name).then((doc) => {
						this.order_summary.load_summary_of(doc);
					});
				},
				reset_summary: () => this.order_summary.toggle_summary_placeholder(true)
			}
		})
	}

	init_order_summary() {
		this.order_summary = new erpnext.PointOfSale.PastOrderSummary({
			wrapper: this.$components_wrapper,
			events: {
				get_frm: () => this.frm,

				process_return: (name) => {
					this.recent_order_list.toggle_component(false);
					frappe.db.get_doc('POS Invoice', name).then((doc) => {
						frappe.run_serially([
							() => this.make_return_invoice(doc),
							() => this.cart.load_invoice(),
							() => this.item_selector.toggle_component(true)
						]);
					});
				},
				edit_order: (name) => {
					this.recent_order_list.toggle_component(false);
					frappe.run_serially([
						() => this.frm.refresh(name),
						() => this.frm.call('reset_mode_of_payments'),
						() => this.cart.load_invoice(),
						() => this.item_selector.toggle_component(true)
					]);
				},
				delete_order: (name) => {
					frappe.model.delete_doc(this.frm.doc.doctype, name, () => {
						this.recent_order_list.refresh_list();
					});
				},
				new_order: () => {
					frappe.run_serially([
						() => frappe.dom.freeze(),
						() => this.make_new_invoice(),
						() => this.item_selector.toggle_component(true),
						() => frappe.dom.unfreeze(),
					]);
				}
			}
		})
	}

	toggle_recent_order_list(show) {
		this.toggle_components(!show);
		this.recent_order_list.toggle_component(show);
		this.order_summary.toggle_component(show);
	}

	toggle_components(show) {
		this.cart.toggle_component(show);
		this.item_selector.toggle_component(show);

		// do not show item details or payment if recent order is toggled off
		!show ? (this.item_details.toggle_component(false) || this.payment.toggle_component(false)) : '';
	}

	// make_new_invoice() {
	// 	return frappe.run_serially([
	// 		() => frappe.dom.freeze(),
	// 		() => this.make_sales_invoice_frm(),
	// 		() => this.set_pos_profile_data(),
	// 		() => this.set_pos_profile_status(),
	// 		() => this.cart.load_invoice(),
	// 		() => frappe.dom.unfreeze()
	// 	]);
	// }

	make_material_request_frm() {
		const doctype = 'Material Request';
		return new Promise(resolve => {
			if (this.frm) {
				this.frm = this.get_new_frm(this.frm);
				this.frm.doc.items = [];
				// this.frm.doc.is_pos = 1
				resolve();
			} else {
				frappe.model.with_doctype(doctype, () => {
					this.frm = this.get_new_frm();
					this.frm.doc.items = [];
					// this.frm.doc.is_pos = 1
					resolve();
				});
			}
		});
	}

	get_new_frm(_frm) {
		const doctype = 'Material Request';
		const page = $('<div>');
		const frm = _frm || new frappe.ui.form.Form(doctype, page, false);
		const name = frappe.model.make_new_doc_and_get_name(doctype, true);
		frm.refresh(name);

		return frm;
	}

	// async make_return_invoice(doc) {
	// 	frappe.dom.freeze();
	// 	this.frm = this.get_new_frm(this.frm);
	// 	this.frm.doc.items = [];
	// 	return frappe.call({
	// 		method: "erpnext.accounts.doctype.pos_invoice.pos_invoice.make_sales_return",
	// 		args: {
	// 			'source_name': doc.name,
	// 			'target_doc': this.frm.doc
	// 		},
	// 		callback: (r) => {
	// 			frappe.model.sync(r.message);
	// 			frappe.get_doc(r.message.doctype, r.message.name).__run_link_triggers = false;
	// 			this.set_pos_profile_data().then(() => {
	// 				frappe.dom.unfreeze();
	// 			});
	// 		}
	// 	});
	// }

	// set_pos_profile_data() {
	// 	if (this.company && !this.frm.doc.company) this.frm.doc.company = this.company;
	// 	if ((this.pos_profile && !this.frm.doc.pos_profile) | (this.frm.doc.is_return && this.pos_profile != this.frm.doc.pos_profile)) {
	// 		this.frm.doc.pos_profile = this.pos_profile;
	// 	}

	// 	if (!this.frm.doc.company) return;

	// 	return this.frm.trigger("set_pos_data");
	// }

	// set_pos_profile_status() {
	// 	this.page.set_indicator(this.pos_profile, "blue");
	// }

	async on_cart_update(args) {
		frappe.dom.freeze();
		console.log("Args : ", args);
		let item_row = undefined;
		try {
			let { field, value, item } = args;
			item_row = this.get_item_from_frm(item);
			console.log("Item Row : ", item_row);
			const item_row_exists = !$.isEmptyObject(item_row);

			const from_selector = field === 'qty' && value === "+1";
			if (from_selector){
				console.log("from selctor");
				value = flt(item_row.qty) + flt(value);

			}
			console.log("Field Before: ", field, value);

			if (item_row_exists) {
				console.log("item row exists");

				if (field === 'qty'){
					value = flt(value);
				}

				// if (field === 'warehouse')
				// 	value = value

				// if (['qty', 'conversion_factor'].includes(field) && value > 0 && !this.allow_negative_stock) {
				// 	const qty_needed = field === 'qty' ? value * item_row.conversion_factor : item_row.qty * value;
				// 	await this.check_stock_availability(item_row, qty_needed, item_row.warehouse);
				// }

				// if (this.is_current_item_being_edited(item_row) || from_selector) {
				// 	await frappe.model.set_value(item_row.doctype, item_row.name, field, value);
				// 	this.update_cart_html(item_row);
				// }
				if (this.is_current_item_being_edited(item_row) || from_selector) {
				console.log("Field : ", field, value);
					await frappe.model.set_value(item_row.doctype, item_row.name, field, value);
					this.update_cart_html(item_row);
				}

			} else {
				// if (!this.frm.doc.customer)
				// 	return this.raise_customer_selection_alert();
				if (!this.frm.doc.warehouse){
					return this.raise_target_warehouse_alert();
				}
				console.log("Else Block",item);
				const { item_code, batch_no, serial_no, rate, warehouse } = item;

				if (!item_code)
					return;

				const new_item = { item_code, batch_no, rate, warehouse, [field]: value };

				if (serial_no) {
					await this.check_serial_no_availablilty(item_code, warehouse, serial_no);
					new_item['serial_no'] = serial_no;
				}

				if (field === 'serial_no')
					new_item['qty'] = value.split(`\n`).length || 0;

				// if (field === 'warehouse') {
				// 		new_item['warehouse'] = warehouse
				// }

				item_row = this.frm.add_child('items', new_item);

				// if (field === 'qty' && value !== 0 && !this.allow_negative_stock) {
				// 	const qty_needed = value * item_row.conversion_factor;
				// 	await this.check_stock_availability(item_row, qty_needed, warehouse);
				// }

				await this.trigger_new_item_events(item_row);

				this.update_cart_html(item_row);

				if (this.item_details.$component.is(':visible'))
					this.edit_item_details_of(item_row);

				if (this.check_serial_batch_selection_needed(item_row) && !this.item_details.$component.is(':visible'))
					this.edit_item_details_of(item_row);
			}

		} catch (error) {
			console.log("eroor",error);
		} finally {
			frappe.dom.unfreeze();
			console.log(("on_cart_update :", item_row));
			return item_row;
		}
	}

	raise_customer_selection_alert() {
		frappe.dom.unfreeze();
		frappe.show_alert({
			message: __('You must select a customer before adding an item.'),
			indicator: 'orange'
		});
		frappe.utils.play_sound("error");
	}
	raise_manager_selection_alert() {
		frappe.dom.unfreeze();
		frappe.show_alert({
			message: __('You must select a manager before submitting an item'),
			indicator: 'orange'
		});
		frappe.utils.play_sound("error");
	}
	raise_required_by_alert() {
		frappe.dom.unfreeze();
		frappe.show_alert({
			message: __('You must select a required by date before submitting an item'),
			indicator: 'orange'
		});
		frappe.utils.play_sound("error");
	}
	raise_target_warehouse_alert() {
		frappe.dom.unfreeze();
		frappe.show_alert({
			message: __('You must select a clinic before adding an item in item cart'),
			indicator: 'orange'
		});
		frappe.utils.play_sound("error");
	}

	get_item_from_frm({ name, item_code, batch_no, uom, rate, warehouse }) {
		let item_row = null;
		// console.log("get_item_from_frm : ", name);
		if (name) {
			item_row = this.frm.doc.items.find(i => i.name == name);
		} else {
		console.log("get_item_from_frm",warehouse);
			// if item is clicked twice from item selector
			// then "item_code, batch_no, uom, rate" will help in getting the exact item
			// to increase the qty by one
			const has_batch_no = batch_no;
			item_row = this.frm.doc.items.find(
				i => i.item_code === item_code
				// || (!has_batch_no || (has_batch_no && i.batch_no === batch_no))
				// 	|| (i.uom === uom)
				// 	|| (i.rate == rate)
			);
			if (warehouse){
				if(item_row)
					item_row.warehouse = warehouse;
			}
		}

		return item_row || {};
	}

	edit_item_details_of(item_row) {
		this.item_details.toggle_item_details_section(item_row);
	}

	is_current_item_being_edited(item_row) {
		return item_row.name == this.item_details.current_item.name;
	}

	update_cart_html(item_row, remove_item) {
		this.cart.update_item_html(item_row, remove_item);
		this.cart.update_totals_section(this.frm);
	}

	check_serial_batch_selection_needed(item_row) {
		// right now item details is shown for every type of item.
		// if item details is not shown for every item then this fn will be needed
		const serialized = item_row.has_serial_no;
		const batched = item_row.has_batch_no;
		const no_serial_selected = !item_row.serial_no;
		const no_batch_selected = !item_row.batch_no;

		if ((serialized && no_serial_selected) || (batched && no_batch_selected) ||
			(serialized && batched && (no_batch_selected || no_serial_selected))) {
			return true;
		}
		return false;
	}

	async trigger_new_item_events(item_row) {
		await this.frm.script_manager.trigger('item_code', item_row.doctype, item_row.name);
		await this.frm.script_manager.trigger('qty', item_row.doctype, item_row.name);
	}

	async check_stock_availability(item_row, qty_needed, warehouse) {
		// console.log("Check Stock Availability : ", item_row, qty_needed, warehouse);
		const resp = (await this.get_available_stock(item_row.item_code, warehouse)).message;
		const available_qty = resp[0];
		const is_stock_item = resp[1];

		frappe.dom.unfreeze();
		const bold_item_code = item_row.item_code.bold();
		const bold_warehouse = warehouse.bold();
		const bold_available_qty = available_qty.toString().bold()
		// if (!(available_qty > 0)) {
		// 	if (is_stock_item) {
		// 		frappe.model.clear_doc(item_row.doctype, item_row.name);
		// 		frappe.throw({
		// 			title: __("Not Available"),
		// 			message: __('Item Code: {0} is not available under warehouse {1}.', [bold_item_code, bold_warehouse])
		// 		});
		// 	} else {
		// 		return;
		// 	}
		// } else if (is_stock_item && available_qty < qty_needed) {
		// 	frappe.throw({
		// 		message: __('Stock quantity not enough for Item Code: {0} under warehouse {1}. Available quantity {2}.', [bold_item_code, bold_warehouse, bold_available_qty]),
		// 		indicator: 'orange'
		// 	});
		// 	frappe.utils.play_sound("error");
		// }
		// frappe.dom.freeze();
	}

	async check_serial_no_availablilty(item_code, warehouse, serial_no) {
		const method = "erpnext.stock.doctype.serial_no.serial_no.get_pos_reserved_serial_nos";
		const args = {filters: { item_code, warehouse }}
		const res = await frappe.call({ method, args });

		if (res.message.includes(serial_no)) {
			frappe.throw({
				title: __("Not Available"),
				message: __('Serial No: {0} has already been transacted into another POS Invoice.', [serial_no.bold()])
			});
		}
	}

	get_available_stock(item_code, warehouse) {
		const me = this;
		return frappe.call({
			method: "dezy_custom.dezy_custom.page.material_request_cus.material_request_cus.get_stock_availability",
			args: {
				'item_code': item_code,
				'warehouse': warehouse
			},
			callback(res) {
			console.log("get_availbel_stock",res.message);
				if (!me.item_stock_map[item_code])
					me.item_stock_map[item_code] = {};
				me.item_stock_map[item_code][warehouse] = res.message;
			}
		});
	}

	update_item_field(value, field_or_action) {
		if (field_or_action === 'checkout') {
			this.item_details.toggle_item_details_section(null);
		} else if (field_or_action === 'remove') {
			this.remove_item_from_cart();
		} else {
			const field_control = this.item_details[`${field_or_action}_control`];
			if (!field_control) return;
			field_control.set_focus();
			value != "" && field_control.set_value(value);
		}
	}

	remove_item_from_cart() {
		frappe.dom.freeze();
		const { doctype, name, current_item } = this.item_details;

		return frappe.model.set_value(doctype, name, 'qty', 0)
			.then(() => {
				frappe.model.clear_doc(doctype, name);
				this.update_cart_html(current_item, true);
				this.item_details.toggle_item_details_section(null);
				frappe.dom.unfreeze();
			})
			.catch(e => console.log(e));
	}

	async save_and_checkout() {
		if (this.frm.is_dirty()) {
			let save_error = false;
			await this.frm.save(null, null, null, () => save_error = true);
			// only move to payment section if save is successful
			// !save_error && this.payment.checkout();
			// show checkout button on error
			save_error && setTimeout(() => {
				this.cart.toggle_checkout_btn(true);
			}, 300); // wait for save to finish
		}
	}
};

//------------------------------------------------------------------------------------------------------------------------------------------

class ItemCart{
	constructor({ wrapper, events, settings }) {
		this.wrapper = wrapper;
		this.events = events;
		this.customer_info = undefined;
		this.hide_images = settings.hide_images;
		this.allowed_customer_groups = settings.customer_groups;
		this.allow_rate_change = settings.allow_rate_change;
		this.allow_discount_change = settings.allow_discount_change;
		this.init_component();
	}

	init_component() {
		this.prepare_dom();
		this.init_child_components();
		this.bind_events();
		// this.attach_shortcuts();
	}

	prepare_dom() {
		this.wrapper.append(
			`<section class="customer-cart-container"></section>`
		)

		this.$component = this.wrapper.find('.customer-cart-container');
	}

	init_child_components() {
		// this.init_customer_selector();
		this.init_fields();
		this.init_cart_components();
	}

	init_customer_selector() {
		this.$component.append(
			`<div class="customer-section"></div>`
		)
		this.$customer_section = this.$component.find('.customer-section');
		this.make_customer_selector();
	}
	init_fields() {
		this.$component.append(
			`<div class="field-section"></div>`
		)
		this.$field_section = this.$component.find('.field-section');
		console.log(this.$field_section);
		// this.make_fields();
	}

	reset_customer_selector() {
		const frm = this.events.get_frm();
		frm.set_value('customer', '');
		this.make_customer_selector();
		this.customer_field.set_focus();
	}

	init_cart_components() {
		this.$component.append(
			`<div class="cart-container">
				<div class="abs-cart-container">
					<div class="cart-label">${__('Item Cart')}</div>
					<div class="cart-header">
						<div class="name-header">${__('Item')}</div>
						<div class="qty-header">${__('Quantity')}</div>
					</div>
					<div class="cart-items-section"></div>
					<div class="cart-totals-section"></div>
					<div class="numpad-section"></div>
				</div>
			</div>`
		);
		this.$cart_container = this.$component.find('.cart-container');

		this.make_cart_totals_section();
		this.make_cart_items_section();
		this.make_cart_numpad();
	}

	make_cart_items_section() {
		this.$cart_header = this.$component.find('.cart-header');
		this.$cart_items_wrapper = this.$component.find('.cart-items-section');

		this.make_no_items_placeholder();
	}

	make_no_items_placeholder() {
		this.$cart_header.css('display', 'none');
		this.$cart_items_wrapper.html(
			`<div class="no-item-wrapper">${__('No items in cart')}</div>`
		);
	}

	get_discount_icon() {
		return (
			`<svg class="discount-icon" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M19 15.6213C19 15.2235 19.158 14.842 19.4393 14.5607L20.9393 13.0607C21.5251 12.4749 21.5251 11.5251 20.9393 10.9393L19.4393 9.43934C19.158 9.15804 19 8.7765 19 8.37868V6.5C19 5.67157 18.3284 5 17.5 5H15.6213C15.2235 5 14.842 4.84196 14.5607 4.56066L13.0607 3.06066C12.4749 2.47487 11.5251 2.47487 10.9393 3.06066L9.43934 4.56066C9.15804 4.84196 8.7765 5 8.37868 5H6.5C5.67157 5 5 5.67157 5 6.5V8.37868C5 8.7765 4.84196 9.15804 4.56066 9.43934L3.06066 10.9393C2.47487 11.5251 2.47487 12.4749 3.06066 13.0607L4.56066 14.5607C4.84196 14.842 5 15.2235 5 15.6213V17.5C5 18.3284 5.67157 19 6.5 19H8.37868C8.7765 19 9.15804 19.158 9.43934 19.4393L10.9393 20.9393C11.5251 21.5251 12.4749 21.5251 13.0607 20.9393L14.5607 19.4393C14.842 19.158 15.2235 19 15.6213 19H17.5C18.3284 19 19 18.3284 19 17.5V15.6213Z" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15 9L9 15" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M10.5 9.5C10.5 10.0523 10.0523 10.5 9.5 10.5C8.94772 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.94772 8.5 9.5 8.5C10.0523 8.5 10.5 8.94772 10.5 9.5Z" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M15.5 14.5C15.5 15.0523 15.0523 15.5 14.5 15.5C13.9477 15.5 13.5 15.0523 13.5 14.5C13.5 13.9477 13.9477 13.5 14.5 13.5C15.0523 13.5 15.5 13.9477 15.5 14.5Z" fill="white" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>`
		);
	}

	make_cart_totals_section() {
		this.$totals_section = this.$component.find('.cart-totals-section');

		this.$totals_section.append(
			`<div class="item-qty-total-container">
				<div class="item-qty-total-label">${__('Total Items')}</div>
				<div class="item-qty-total-value">0.00</div>
			</div>
			<div class="checkout-btn">${__('Submit')}</div>`
		)

		this.$add_discount_elem = this.$component.find(".add-discount-wrapper");
	}

	make_cart_numpad() {
		this.$numpad_section = this.$component.find('.numpad-section');

		this.number_pad = new NumberPad({
			wrapper: this.$numpad_section,
			events: {
				numpad_event: this.on_numpad_event.bind(this)
			},
			cols: 5,
			keys: [
				[ 1, 2, 3, 'Quantity' ],
				[ 4, 5, 6, 'Discount' ],
				[ 7, 8, 9, 'Rate' ],
				[ '.', 0, 'Delete', 'Remove' ]
			],
			css_classes: [
				[ '', '', '', 'col-span-2' ],
				[ '', '', '', 'col-span-2' ],
				[ '', '', '', 'col-span-2' ],
				[ '', '', '', 'col-span-2 remove-btn' ]
			],
			fieldnames_map: { 'Quantity': 'qty', 'Discount': 'discount_percentage' }
		})

		this.$numpad_section.prepend(
			`<div class="numpad-totals">
			<span class="numpad-item-qty-total"></span>
				<span class="numpad-net-total"></span>
				<span class="numpad-grand-total"></span>
			</div>`
		)

		this.$numpad_section.append(
			`<div class="numpad-btn checkout-btn" data-button-value="checkout">${__('Submit')}</div>`
		)
	}

	bind_events() {
		const me = this;
		// this.$customer_section.on('click', '.reset-customer-btn', function () {
		// 	me.reset_customer_selector();
		// });

		// this.$customer_section.on('click', '.close-details-btn', function () {
		// 	me.toggle_customer_info(false);
		// });

		// this.$customer_section.on('click', '.customer-display', function(e) {
		// 	if ($(e.target).closest('.reset-customer-btn').length) return;

		// 	const show = me.$cart_container.is(':visible');
		// 	me.toggle_customer_info(show);
		// });

		this.$cart_items_wrapper.on('click', '.cart-item-wrapper', function() {
			const $cart_item = $(this);

			me.toggle_item_highlight(this);

			const payment_section_hidden = !me.$totals_section.find('.edit-cart-btn').is(':visible');
			if (!payment_section_hidden) {
				// payment section is visible
				// edit cart first and then open item details section
				me.$totals_section.find(".edit-cart-btn").click();
			}

			const item_row_name = unescape($cart_item.attr('data-row-name'));
			me.events.cart_item_clicked({ name: item_row_name });
			this.numpad_value = '';
		});

		this.$component.on('click', '.checkout-btn', async function() {
			frappe.dom.freeze();
			if ($(this).attr('style').indexOf('--blue-500') == -1) return;
			await me.events.checkout();
			me.toggle_checkout_btn(false);

			me.allow_discount_change && me.$add_discount_elem.removeClass("d-none");
			// frappe.dom.unfreeze();
			await frappe.msgprint({"message":"Material request has been created successfully","title":"Material Request Created" });
			window.location.reload()
		})
		this.$totals_section.on('click', '.edit-cart-btn', () => {
			this.events.edit_cart();
			this.toggle_checkout_btn(true);
		});

		this.$component.on('click', '.add-discount-wrapper', () => {
			const can_edit_discount = this.$add_discount_elem.find('.edit-discount-btn').length;

			if(!this.discount_field || can_edit_discount) this.show_discount_control();
		});

		frappe.ui.form.on("POS Invoice", "paid_amount", frm => {
			// called when discount is applied
			this.update_totals_section(frm);
		});
	}

	attach_shortcuts() {
		for (let row of this.number_pad.keys) {
			for (let btn of row) {
				if (typeof btn !== 'string') continue; // do not make shortcuts for numbers

				let shortcut_key = `ctrl+${frappe.scrub(String(btn))[0]}`;
				if (btn === 'Delete') shortcut_key = 'ctrl+backspace';
				if (btn === 'Remove') shortcut_key = 'shift+ctrl+backspace'
				if (btn === '.') shortcut_key = 'ctrl+>';

				// to account for fieldname map
				const fieldname = this.number_pad.fieldnames[btn] ? this.number_pad.fieldnames[btn] :
					typeof btn === 'string' ? frappe.scrub(btn) : btn;

				let shortcut_label = shortcut_key.split('+').map(frappe.utils.to_title_case).join('+');
				shortcut_label = frappe.utils.is_mac() ? shortcut_label.replace('Ctrl', '⌘') : shortcut_label;
				this.$numpad_section.find(`.numpad-btn[data-button-value="${fieldname}"]`).attr("title", shortcut_label);

				frappe.ui.keys.on(`${shortcut_key}`, () => {
					const cart_is_visible = this.$component.is(":visible");
					if (cart_is_visible && this.item_is_selected && this.$numpad_section.is(":visible")) {
						this.$numpad_section.find(`.numpad-btn[data-button-value="${fieldname}"]`).click();
					}
				})
			}
		}
		const ctrl_label = frappe.utils.is_mac() ? '⌘' : 'Ctrl';
		this.$component.find(".checkout-btn").attr("title", `${ctrl_label}+Enter`);
		frappe.ui.keys.add_shortcut({
			shortcut: "ctrl+enter",
			action: () => this.$component.find(".checkout-btn").click(),
			condition: () => this.$component.is(":visible") && !this.$totals_section.find('.edit-cart-btn').is(':visible'),
			description: __("Checkout Order / Submit Order / New Order"),
			ignore_inputs: true,
			page: cur_page.page.page
		});
		this.$component.find(".edit-cart-btn").attr("title", `${ctrl_label}+E`);
		frappe.ui.keys.on("ctrl+e", () => {
			const item_cart_visible = this.$component.is(":visible");
			const checkout_btn_invisible = !this.$totals_section.find('.checkout-btn').is('visible');
			if (item_cart_visible && checkout_btn_invisible) {
				this.$component.find(".edit-cart-btn").click();
			}
		});
		this.$component.find(".add-discount-wrapper").attr("title", `${ctrl_label}+D`);
		frappe.ui.keys.add_shortcut({
			shortcut: "ctrl+d",
			action: () => this.$component.find(".add-discount-wrapper").click(),
			condition: () => this.$add_discount_elem.is(":visible"),
			description: __("Add Order Discount"),
			ignore_inputs: true,
			page: cur_page.page.page
		});
		frappe.ui.keys.on("escape", () => {
			const item_cart_visible = this.$component.is(":visible");
			if (item_cart_visible && this.discount_field && this.discount_field.parent.is(":visible")) {
				this.discount_field.set_value(0);
			}
		});
	}

	toggle_item_highlight(item) {
		const $cart_item = $(item);
		const item_is_highlighted = $cart_item.attr("style") == "background-color:var(--gray-50);";

		if (!item || item_is_highlighted) {
			this.item_is_selected = false;
			this.$cart_container.find('.cart-item-wrapper').css("background-color", "");
		} else {
			$cart_item.css("background-color", "var(--gray-50)");
			this.item_is_selected = true;
			this.$cart_container.find('.cart-item-wrapper').not(item).css("background-color", "");
		}
	}
	make_fields(){
		// console.log("make_fields: ", this);
		this.$field_section.html(`
		<div class="custom-field"></div>
		`);
		let is_source_warehouse = this.$component.find('.custom-field');
		const me = this
		this.manager_field = frappe.ui.form.make_control({
			df: {
				label: __('Manager'),
				fieldtype: 'Link',
				options: 'User',
				placeholder: __('Select Manager'),
				onchange: function () {
					if (this.value) {
						const frm = me.events.get_frm();
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, 'manager', this.value);
						// console.log(frm.doc);
					}
				}
			},
			parent: this.$component.find('.custom-field'),
			render_input: true,
		});
		this.purpose_field = frappe.ui.form.make_control({
			df: {
				label: __('Purpose'),
				fieldtype: 'Select',
				options:[
					'Purchase',
					'Material Transfer',
					'Material Issue',
					'Manufacture',
					'Customer Provided'
				],
				placeholder: __('Default Purchase'),
				onchange: function () {
					console.log(this);
					if (this.value == "Material Transfer") {
					const frm = me.events.get_frm();
					is_source_warehouse["0"].lastChild.hidden = false;
					console.log("if block",frm.doc.name);
					frappe.model.set_value(frm.doc.doctype, frm.doc.name, "material_request_type", this.value)
				}
				else if(this.value === 'Purchase'){
					const frm = me.events.get_frm();
					// const frm = me.events.get_frm().doc;
					console.log("else block :", frm);
					is_source_warehouse["0"].lastChild.hidden = true;
					frappe.model.set_value(frm.doc.doctype, frm.doc.name, "material_request_type", this.value)
				}
				},
			},
			parent: this.$component.find('.custom-field'),
			render_input: true,
		});
		this.required_by = frappe.ui.form.make_control({
			df: {
				label: __('Required By'),
				fieldtype: 'Date',
				onchange: function () {
					const frm = me.events.get_frm()
					frappe.model.set_value(frm.doc.doctype, frm.doc.name, "schedule_date", this.value)
				}
			},
			parent: this.$component.find('.custom-field'),
			render_input: true,
		});
		// this.required_by.set_value(frappe.datetime.get_today())

		this.source_warehouse = frappe.ui.form.make_control({
			df: {
				label: __('Source Warehouse'),
				fieldtype: 'Link',
				options:'Warehouse',
				placeholder: __('Source Warehouse'),
				onchange: function () {
					if (this.value) {
						const frm = me.events.get_frm()
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, "set_from_warehouse", this.value)
					}
				},
				get_query: function () {
					const doc = me.events.get_frm().doc
					return {
						query: 'dezy_custom.dezy_custom.page.material_request_cus.material_request_cus.warehouse_query',
						filters: {
							company:doc.company
						}
					};
				},
			},
			parent: this.$component.find('.custom-field'),
			render_input: true,
		});
		// console.log("Source Warehouse",custom_field["0"]);
		is_source_warehouse["0"].lastChild.hidden = true;

	}
	make_source_warehouse() {
		const doc = this.events.get_frm().doc;
		this.source_warehouse = frappe.ui.form.make_control({
			df: {
				label: __('Source Warehouse'),
				fieldtype: 'Link',
				options:'Warehouse',
				placeholder: __('Warehouse'),
				get_query: function () {
					return {
						query: 'dezy_custom.dezy_custom.page.material_request_cus.material_request_cus.warehouse_query',
						filters: {
							company:doc.company
						}
					};
				},
			},
			parent: this.$component.find('.custom-field'),
			render_input: true,
		});
	}
	make_customer_selector() {
		this.$customer_section.html(`
			<div class="customer-field"></div>
		`);
		const me = this;
		const query = { query: 'erpnext.controllers.queries.customer_query' };
		const allowed_customer_group = this.allowed_customer_groups || [];
		if (allowed_customer_group.length) {
			query.filters = {
				customer_group: ['in', allowed_customer_group]
			}
		}
		this.customer_field = frappe.ui.form.make_control({
			df: {
				label: __('Customer'),
				fieldtype: 'Link',
				options: 'Customer',
				placeholder: __('Search by customer name, phone, email.'),
				get_query: () => query,
				onchange: function() {
					if (this.value) {
						const frm = me.events.get_frm();
						frappe.dom.freeze();
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, 'customer', this.value);
						frm.script_manager.trigger('customer', frm.doc.doctype, frm.doc.name).then(() => {
							frappe.run_serially([
								() => me.fetch_customer_details(this.value),
								() => me.events.customer_details_updated(me.customer_info),
								() => me.update_customer_section(),
								() => me.update_totals_section(),
								() => frappe.dom.unfreeze()
							]);
						})
					}
				},
			},
			parent: this.$customer_section.find('.customer-field'),
			render_input: true,
		});
		this.customer_field.toggle_label(false);
	}
	// set_manager_field(manager) {
	// 	if (manager) {

	// 	}
	// }

	fetch_customer_details(customer) {
		if (customer) {
			return new Promise((resolve) => {
				frappe.db.get_value('Customer', customer, ["email_id", "mobile_no", "image", "loyalty_program"]).then(({ message }) => {
					const { loyalty_program } = message;
					// if loyalty program then fetch loyalty points too
					if (loyalty_program) {
						frappe.call({
							method: "erpnext.accounts.doctype.loyalty_program.loyalty_program.get_loyalty_program_details_with_points",
							args: { customer, loyalty_program, "silent": true },
							callback: (r) => {
								const { loyalty_points, conversion_factor } = r.message;
								if (!r.exc) {
									this.customer_info = { ...message, customer, loyalty_points, conversion_factor };
									resolve();
								}
							}
						});
					} else {
						this.customer_info = { ...message, customer };
						resolve();
					}
				});
			});
		} else {
			return new Promise((resolve) => {
				this.customer_info = {}
				resolve();
			});
		}
	}

	show_discount_control() {
		this.$add_discount_elem.css({ 'padding': '0px', 'border': 'none' });
		this.$add_discount_elem.html(
			`<div class="add-discount-field"></div>`
		);
		const me = this;
		const frm = me.events.get_frm();
		let discount = frm.doc.additional_discount_percentage;

		this.discount_field = frappe.ui.form.make_control({
			df: {
				label: __('Discount'),
				fieldtype: 'Data',
				placeholder: ( discount ? discount + '%' :  __('Enter discount percentage.') ),
				input_class: 'input-xs',
				onchange: function() {
					if (flt(this.value) != 0) {
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, 'additional_discount_percentage', flt(this.value));
						me.hide_discount_control(this.value);
					} else {
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, 'additional_discount_percentage', 0);
						me.$add_discount_elem.css({
							'border': '1px dashed var(--gray-500)',
							'padding': 'var(--padding-sm) var(--padding-md)'
						});
						me.$add_discount_elem.html(`${me.get_discount_icon()} ${__('Add Discount')}`);
						me.discount_field = undefined;
					}
				},
			},
			parent: this.$add_discount_elem.find('.add-discount-field'),
			render_input: true,
		});
		this.discount_field.toggle_label(false);
		this.discount_field.set_focus();
	}

	hide_discount_control(discount) {
		if (!discount) {
			this.$add_discount_elem.css({ 'padding': '0px', 'border': 'none' });
			this.$add_discount_elem.html(
				`<div class="add-discount-field"></div>`
			);
		} else {
			this.$add_discount_elem.css({
				'border': '1px dashed var(--dark-green-500)',
				'padding': 'var(--padding-sm) var(--padding-md)'
			});
			this.$add_discount_elem.html(
				`<div class="edit-discount-btn">
					${this.get_discount_icon()} ${__("Additional")}&nbsp;${String(discount).bold()}% ${__("discount applied")}
				</div>`
			);
		}
	}

	update_customer_section() {
		const me = this;
		const { customer, email_id='', mobile_no='', image } = this.customer_info || {};

		if (customer) {
			this.$customer_section.html(
				`<div class="customer-details">
					<div class="customer-display">
						${this.get_customer_image()}
						<div class="customer-name-desc">
							<div class="customer-name">${customer}</div>
							${get_customer_description()}
						</div>
						<div class="reset-customer-btn" data-customer="${escape(customer)}">
							<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
								<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
							</svg>
						</div>
					</div>
				</div>`
			);
		} else {
			// reset customer selector
			this.reset_customer_selector();
		}

		function get_customer_description() {
			if (!email_id && !mobile_no) {
				return `<div class="customer-desc">${__('Click to add email / phone')}</div>`;
			} else if (email_id && !mobile_no) {
				return `<div class="customer-desc">${email_id}</div>`;
			} else if (mobile_no && !email_id) {
				return `<div class="customer-desc">${mobile_no}</div>`;
			} else {
				return `<div class="customer-desc">${email_id} - ${mobile_no}</div>`;
			}
		}

	}

	get_customer_image() {
		const { customer, image } = this.customer_info || {};
		if (image) {
			return `<div class="customer-image"><img src="${image}" alt="${image}""></div>`;
		} else {
			return `<div class="customer-image customer-abbr">${frappe.get_abbr(customer)}</div>`;
		}
	}

	update_totals_section(frm) {
		if (!frm) frm = this.events.get_frm();

		// this.render_net_total(frm.doc.net_total);
		this.render_total_item_qty(frm.doc.items);
		// const grand_total = cint(frappe.sys_defaults.disable_rounded_total) ? frm.doc.grand_total : frm.doc.rounded_total;
		// this.render_grand_total(grand_total);

		// this.render_taxes(frm.doc.taxes);
	}

	// render_net_total(value) {
	// 	const currency = this.events.get_frm().doc.currency;
	// 	this.$totals_section.find('.net-total-container').html(
	// 		`<div>${__('Net Total')}</div><div>${format_currency(value, currency)}</div>`
	// 	)

	// 	this.$numpad_section.find('.numpad-net-total').html(
	// 		`<div>${__('Net Total')}: <span>${format_currency(value, currency)}</span></div>`
	// 	);
	// }

	render_total_item_qty(items) {
		var total_item_qty = 0;
		items.map((item) => {
			total_item_qty = total_item_qty + item.qty;
		});

		this.$totals_section.find('.item-qty-total-container').html(
			`<div>${__('Total Quantity')}</div><div>${total_item_qty}</div>`
		);

		this.$numpad_section.find('.numpad-item-qty-total').html(
			`<div>${__('Total Quantity')}: <span>${total_item_qty}</span></div>`
		);
	}

	// render_grand_total(value) {
	// 	const currency = this.events.get_frm().doc.currency;
	// 	this.$totals_section.find('.grand-total-container').html(
	// 		`<div>${__('Grand Total')}</div><div>${format_currency(value, currency)}</div>`
	// 	)

	// 	this.$numpad_section.find('.numpad-grand-total').html(
	// 		`<div>${__('Grand Total')}: <span>${format_currency(value, currency)}</span></div>`
	// 	);
	// }

	// render_taxes(taxes) {
	// 	if (taxes.length) {
	// 		const currency = this.events.get_frm().doc.currency;
	// 		const taxes_html = taxes.map(t => {
	// 			if (t.tax_amount_after_discount_amount == 0.0) return;
	// 			const description = /[0-9]+/.test(t.description) ? t.description : `${t.description} @ ${t.rate}%`;
	// 			return `<div class="tax-row">
	// 				<div class="tax-label">${description}</div>
	// 				<div class="tax-value">${format_currency(t.tax_amount_after_discount_amount, currency)}</div>
	// 			</div>`;
	// 		}).join('');
	// 		this.$totals_section.find('.taxes-container').css('display', 'flex').html(taxes_html);
	// 	} else {
	// 		this.$totals_section.find('.taxes-container').css('display', 'none').html('');
	// 	}
	// }

	get_cart_item({ name }) {
		const item_selector = `.cart-item-wrapper[data-row-name="${escape(name)}"]`;
		return this.$cart_items_wrapper.find(item_selector);
	}

	get_item_from_frm(item) {
		const doc = this.events.get_frm().doc;
		return doc.items.find(i => i.name == item.name);
	}

	update_item_html(item, remove_item) {
		const $item = this.get_cart_item(item);
		console.log("Upadte_item_html: ", $item, remove_item);

		if (remove_item) {
			$item && $item.next().remove() && $item.remove();
		} else {
			const item_row = this.get_item_from_frm(item);
			this.render_cart_item(item_row, $item);
		}

		const no_of_cart_items = this.$cart_items_wrapper.find('.cart-item-wrapper').length;
		this.highlight_checkout_btn(no_of_cart_items > 0);
		this.update_empty_cart_section(no_of_cart_items);
	}

	render_cart_item(item_data, $item_to_update) {
		const currency = this.events.get_frm().doc.currency;
		const me = this;
		if (!$item_to_update.length) {
			this.$cart_items_wrapper.append(
				`<div class="cart-item-wrapper" data-row-name="${escape(item_data.name)}"></div>
				<div class="seperator"></div>`
				)
				$item_to_update = this.get_cart_item(item_data);
			}
			console.log("Render Cart Item : ", item_data, $item_to_update);

		$item_to_update.html(
			`${get_item_image_html()}
			<div class="item-name-desc">
				<div class="item-name">
					${item_data.item_name}
				</div>
				${get_description_html()}
			</div>
			${get_rate_discount_html()}`
		)

		set_dynamic_rate_header_width();

		function set_dynamic_rate_header_width() {
			const rate_cols = Array.from(me.$cart_items_wrapper.find(".item-rate-amount"));
			me.$cart_header.find(".rate-amount-header").css("width", "");
			me.$cart_items_wrapper.find(".item-rate-amount").css("width", "");
			let max_width = rate_cols.reduce((max_width, elm) => {
				if ($(elm).width() > max_width)
					max_width = $(elm).width();
				return max_width;
			}, 0);

			max_width += 1;
			if (max_width == 1) max_width = "";

			me.$cart_header.find(".rate-amount-header").css("width", max_width);
			me.$cart_items_wrapper.find(".item-rate-amount").css("width", max_width);
		}

		function get_rate_discount_html() {
			if (item_data.rate && item_data.amount && item_data.rate !== item_data.amount) {
				return `
					<div class="item-qty-rate">
						<div class="item-qty"><span>${item_data.qty || 0}</span></div>
					</div>`
			} else {
				return `
					<div class="item-qty-rate">
						<div class="item-qty"><span>${item_data.qty || 0}</span></div>
					</div>`
			}
		}

		function get_description_html() {
			if (item_data.description) {
				if (item_data.description.indexOf('<div>') != -1) {
					try {
						item_data.description = $(item_data.description).text();
					} catch (error) {
						item_data.description = item_data.description.replace(/<div>/g, ' ').replace(/<\/div>/g, ' ').replace(/ +/g, ' ');
					}
				}
				item_data.description = frappe.ellipsis(item_data.description, 45);
				return `<div class="item-desc">${item_data.description}</div>`;
			}
			return ``;
		}

		function get_item_image_html() {
			const { image, item_name } = item_data;
			if (!me.hide_images && image) {
				return `
					<div class="item-image">
						<img
							onerror="cur_pos.cart.handle_broken_image(this)"
							src="${image}" alt="${frappe.get_abbr(item_name)}"">
					</div>`;
			} else {
				return `<div class="item-image item-abbr">${frappe.get_abbr(item_name)}</div>`;
			}
		}
	}

	handle_broken_image($img) {
		const item_abbr = $($img).attr('alt');
		$($img).parent().replaceWith(`<div class="item-image item-abbr">${item_abbr}</div>`);
	}

	update_selector_value_in_cart_item(selector, value, item) {
		const $item_to_update = this.get_cart_item(item);
		$item_to_update.attr(`data-${selector}`, escape(value));
	}

	toggle_checkout_btn(show_checkout) {
		if (show_checkout) {
			this.$totals_section.find('.checkout-btn').css('display', 'flex');
			this.$totals_section.find('.edit-cart-btn').css('display', 'none');
		} else {
			this.$totals_section.find('.checkout-btn').css('display', 'none');
			this.$totals_section.find('.edit-cart-btn').css('display', 'flex');
		}
	}

	highlight_checkout_btn(toggle) {
		if (toggle) {
			this.$add_discount_elem.css('display', 'flex');
			this.$cart_container.find('.checkout-btn').css({
				'background-color': 'var(--blue-500)'
			});
		} else {
			this.$add_discount_elem.css('display', 'none');
			this.$cart_container.find('.checkout-btn').css({
				'background-color': 'var(--blue-200)'
			});
		}
	}

	update_empty_cart_section(no_of_cart_items) {
		const $no_item_element = this.$cart_items_wrapper.find('.no-item-wrapper');

		// if cart has items and no item is present
		no_of_cart_items > 0 && $no_item_element && $no_item_element.remove() && this.$cart_header.css('display', 'flex');

		no_of_cart_items === 0 && !$no_item_element.length && this.make_no_items_placeholder();
	}

	on_numpad_event($btn) {
		const current_action = $btn.attr('data-button-value');
		const action_is_field_edit = ['qty', 'discount_percentage', 'rate'].includes(current_action);
		const action_is_allowed = action_is_field_edit ? (
			(current_action == 'rate' && this.allow_rate_change) ||
			(current_action == 'discount_percentage' && this.allow_discount_change) ||
			(current_action == 'qty')) : true;

		const action_is_pressed_twice = this.prev_action === current_action;
		const first_click_event = !this.prev_action;
		const field_to_edit_changed = this.prev_action && this.prev_action != current_action;

		if (action_is_field_edit) {
			if (!action_is_allowed) {
				const label = current_action == 'rate' ? 'Rate'.bold() : 'Discount'.bold();
				const message = __('Editing {0} is not allowed as per POS Profile settings', [label]);
				frappe.show_alert({
					indicator: 'red',
					message: message
				});
				frappe.utils.play_sound("error");
				return;
			}

			if (first_click_event || field_to_edit_changed) {
				this.prev_action = current_action;
			} else if (action_is_pressed_twice) {
				this.prev_action = undefined;
			}
			this.numpad_value = '';

		} else if (current_action === 'checkout') {
			this.prev_action = undefined;
			this.toggle_item_highlight();
			this.events.numpad_event(undefined, current_action);
			return;
		} else if (current_action === 'remove') {
			this.prev_action = undefined;
			this.toggle_item_highlight();
			this.events.numpad_event(undefined, current_action);
			return;
		} else {
			this.numpad_value = current_action === 'delete' ? this.numpad_value.slice(0, -1) : this.numpad_value + current_action;
			this.numpad_value = this.numpad_value || 0;
		}

		const first_click_event_is_not_field_edit = !action_is_field_edit && first_click_event;

		if (first_click_event_is_not_field_edit) {
			frappe.show_alert({
				indicator: 'red',
				message: __('Please select a field to edit from numpad')
			});
			frappe.utils.play_sound("error");
			return;
		}

		if (flt(this.numpad_value) > 100 && this.prev_action === 'discount_percentage') {
			frappe.show_alert({
				message: __('Discount cannot be greater than 100%'),
				indicator: 'orange'
			});
			frappe.utils.play_sound("error");
			this.numpad_value = current_action;
		}

		this.highlight_numpad_btn($btn, current_action);
		this.events.numpad_event(this.numpad_value, this.prev_action);
	}

	highlight_numpad_btn($btn, curr_action) {
		const curr_action_is_highlighted = $btn.hasClass('highlighted-numpad-btn');
		const curr_action_is_action = ['qty', 'discount_percentage', 'rate', 'done'].includes(curr_action);

		if (!curr_action_is_highlighted) {
			$btn.addClass('highlighted-numpad-btn');
		}
		if (this.prev_action === curr_action && curr_action_is_highlighted) {
			// if Qty is pressed twice
			$btn.removeClass('highlighted-numpad-btn');
		}
		if (this.prev_action && this.prev_action !== curr_action && curr_action_is_action) {
			// Order: Qty -> Rate then remove Qty highlight
			const prev_btn = $(`[data-button-value='${this.prev_action}']`);
			prev_btn.removeClass('highlighted-numpad-btn');
		}
		if (!curr_action_is_action || curr_action === 'done') {
			// if numbers are clicked
			setTimeout(() => {
				$btn.removeClass('highlighted-numpad-btn');
			}, 200);
		}
	}

	toggle_numpad(show) {
		if (show) {
			this.$totals_section.css('display', 'none');
			this.$numpad_section.css('display', 'flex');
		} else {
			this.$totals_section.css('display', 'flex');
			this.$numpad_section.css('display', 'none');
		}
		this.reset_numpad();
	}

	reset_numpad() {
		this.numpad_value = '';
		this.prev_action = undefined;
		this.$numpad_section.find('.highlighted-numpad-btn').removeClass('highlighted-numpad-btn');
	}

	toggle_numpad_field_edit(fieldname) {
		if (['qty', 'discount_percentage', 'rate'].includes(fieldname)) {
			this.$numpad_section.find(`[data-button-value="${fieldname}"]`).click();
		}
	}

	toggle_customer_info(show) {
		if (show) {
			const { customer } = this.customer_info || {};

			this.$cart_container.css('display', 'none');
			this.$customer_section.css({
				'height': '100%',
				'padding-top': '0px'
			});
			this.$customer_section.find('.customer-details').html(
				`<div class="header">
					<div class="label">Contact Details</div>
					<div class="close-details-btn">
						<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
							<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
						</svg>
					</div>
				</div>
				<div class="customer-display">
					${this.get_customer_image()}
					<div class="customer-name-desc">
						<div class="customer-name">${customer}</div>
						<div class="customer-desc"></div>
					</div>
				</div>
				<div class="customer-fields-container">
					<div class="email_id-field"></div>
					<div class="mobile_no-field"></div>
					<div class="loyalty_program-field"></div>
					<div class="loyalty_points-field"></div>
				</div>
				<div class="transactions-label">Recent Transactions</div>`
			);
			// transactions need to be in diff div from sticky elem for scrolling
			this.$customer_section.append(`<div class="customer-transactions"></div>`);

			this.render_customer_fields();
			this.fetch_customer_transactions();

		} else {
			this.$cart_container.css('display', 'flex');
			this.$customer_section.css({
				'height': '',
				'padding-top': ''
			});

			this.update_customer_section();
		}
	}

	render_customer_fields() {
		const $customer_form = this.$customer_section.find('.customer-fields-container');

		const dfs = [{
			fieldname: 'email_id',
			label: __('Email'),
			fieldtype: 'Data',
			options: 'email',
			placeholder: __("Enter customer's email")
		},{
			fieldname: 'mobile_no',
			label: __('Phone Number'),
			fieldtype: 'Data',
			placeholder: __("Enter customer's phone number")
		},{
			fieldname: 'loyalty_program',
			label: __('Loyalty Program'),
			fieldtype: 'Link',
			options: 'Loyalty Program',
			placeholder: __("Select Loyalty Program")
		},{
			fieldname: 'loyalty_points',
			label: __('Loyalty Points'),
			fieldtype: 'Data',
			read_only: 1
		}];

		const me = this;
		dfs.forEach(df => {
			this[`customer_${df.fieldname}_field`] = frappe.ui.form.make_control({
				df: { ...df,
					onchange: handle_customer_field_change,
				},
				parent: $customer_form.find(`.${df.fieldname}-field`),
				render_input: true,
			});
			this[`customer_${df.fieldname}_field`].set_value(this.customer_info[df.fieldname]);
		})

		function handle_customer_field_change() {
			const current_value = me.customer_info[this.df.fieldname];
			const current_customer = me.customer_info.customer;

			if (this.value && current_value != this.value && this.df.fieldname != 'loyalty_points') {
				frappe.call({
					method: 'erpnext.selling.page.point_of_sale.point_of_sale.set_customer_info',
					args: {
						fieldname: this.df.fieldname,
						customer: current_customer,
						value: this.value
					},
					callback: (r) => {
						if(!r.exc) {
							me.customer_info[this.df.fieldname] = this.value;
							frappe.show_alert({
								message: __("Customer contact updated successfully."),
								indicator: 'green'
							});
							frappe.utils.play_sound("submit");
						}
					}
				});
			}
		}
	}

	fetch_customer_transactions() {
		frappe.db.get_list('POS Invoice', {
			filters: { customer: this.customer_info.customer, docstatus: 1 },
			fields: ['name', 'grand_total', 'status', 'posting_date', 'posting_time', 'currency'],
			limit: 20
		}).then((res) => {
			const transaction_container = this.$customer_section.find('.customer-transactions');

			if (!res.length) {
				transaction_container.html(
					`<div class="no-transactions-placeholder">No recent transactions found</div>`
				)
				return;
			};

			const elapsed_time = moment(res[0].posting_date+" "+res[0].posting_time).fromNow();
			this.$customer_section.find('.customer-desc').html(`Last transacted ${elapsed_time}`);

			res.forEach(invoice => {
				const posting_datetime = moment(invoice.posting_date+" "+invoice.posting_time).format("Do MMMM, h:mma");
				let indicator_color = {
					'Paid': 'green',
					'Draft': 'red',
					'Return': 'gray',
					'Consolidated': 'blue'
				};

				transaction_container.append(
					`<div class="invoice-wrapper" data-invoice-name="${escape(invoice.name)}">
						<div class="invoice-name-date">
							<div class="invoice-name">${invoice.name}</div>
							<div class="invoice-date">${posting_datetime}</div>
						</div>
						<div class="invoice-total-status">
							<div class="invoice-total">
								${format_currency(invoice.grand_total, invoice.currency, 0) || 0}
							</div>
							<div class="invoice-status">
								<span class="indicator-pill whitespace-nowrap ${indicator_color[invoice.status]}">
									<span>${invoice.status}</span>
								</span>
							</div>
						</div>
					</div>
					<div class="seperator"></div>`
				)
			});
		});
	}

	attach_refresh_field_event(frm) {
		$(frm.wrapper).off('refresh-fields');
		$(frm.wrapper).on('refresh-fields', () => {
			if (frm.doc.items.length) {
				this.$cart_items_wrapper.html('');
				frm.doc.items.forEach(item => {
					this.update_item_html(item);
				});
			}
			this.update_totals_section(frm);
		});
	}

	load_invoice() {
		const frm = this.events.get_frm();

		this.attach_refresh_field_event(frm);

		this.fetch_customer_details(frm.doc.customer).then(() => {
			this.events.customer_details_updated(this.customer_info);
			this.update_customer_section();
		});

		this.$cart_items_wrapper.html('');
		if (frm.doc.items.length) {
			frm.doc.items.forEach(item => {
				this.update_item_html(item);
			});
		} else {
			this.make_no_items_placeholder();
			this.highlight_checkout_btn(false);
		}

		this.update_totals_section(frm);

		if(frm.doc.docstatus === 1) {
			this.$totals_section.find('.checkout-btn').css('display', 'none');
			this.$totals_section.find('.edit-cart-btn').css('display', 'none');
		} else {
			this.$totals_section.find('.checkout-btn').css('display', 'flex');
			this.$totals_section.find('.edit-cart-btn').css('display', 'none');
		}

		this.toggle_component(true);
	}

	toggle_component(show) {
		show ? this.$component.css('display', 'flex') : this.$component.css('display', 'none');
	}

}

//------------------------------------------------------------------------------------------------------------------------

class ItemDetails {
	constructor({ wrapper, events, settings }) {
		this.wrapper = wrapper;
		this.events = events;
		this.hide_images = settings.hide_images;
		this.allow_rate_change = settings.allow_rate_change;
		this.allow_discount_change = settings.allow_discount_change;
		this.current_item = {};

		this.init_component();
	}

	init_component() {
		this.prepare_dom();
		this.init_child_components();
		this.bind_events();
		// this.attach_shortcuts();
	}

	prepare_dom() {
		this.wrapper.append(
			`<section class="item-details-container"></section>`
		)

		this.$component = this.wrapper.find('.item-details-container');
	}

	init_child_components() {
		this.$component.html(
			`<div class="item-details-header">
				<div class="label">${__('Item Details')}</div>
				<div class="close-btn">
					<svg width="32" height="32" viewBox="0 0 14 14" fill="none">
						<path d="M4.93764 4.93759L7.00003 6.99998M9.06243 9.06238L7.00003 6.99998M7.00003 6.99998L4.93764 9.06238L9.06243 4.93759" stroke="#8D99A6"/>
					</svg>
				</div>
			</div>
			<div class="item-display">
				<div class="item-name-desc-price">
					<div class="item-name"></div>
					<div class="item-desc"></div>
					<div class="item-code"></div>
				</div>
				<div class="item-image"></div>
			</div>
			<div class="discount-section"></div>
			<div class="form-container"></div>`
		)

		this.$item_name = this.$component.find('.item-name');
		this.$item_description = this.$component.find('.item-desc');
		this.$item_code = this.$component.find('.item-code');
		this.$item_image = this.$component.find('.item-image');
		this.$form_container = this.$component.find('.form-container');
		this.$dicount_section = this.$component.find('.discount-section');
	}

	compare_with_current_item(item) {
		// returns true if `item` is currently being edited
		return item && item.name == this.current_item.name;
	}

	async toggle_item_details_section(item) {
		const current_item_changed = !this.compare_with_current_item(item);

		// if item is null or highlighted cart item is clicked twice
		const hide_item_details = !Boolean(item) || !current_item_changed;

		if ((!hide_item_details && current_item_changed) || hide_item_details) {
			// if item details is being closed OR if item details is opened but item is changed
			// in both cases, if the current item is a serialized item, then validate and remove the item
			await this.validate_serial_batch_item();
		}

		this.events.toggle_item_selector(!hide_item_details);
		this.toggle_component(!hide_item_details);

		if (item && current_item_changed) {
			this.doctype = item.doctype;
			this.item_meta = frappe.get_meta(this.doctype);
			this.name = item.name;
			this.item_row = item;
			this.currency = this.events.get_frm().doc.currency;

			this.current_item = item;

			this.render_dom(item);
			// this.render_discount_dom(item);
			this.render_form(item);
			this.events.highlight_cart_item(item);
		} else {
			this.current_item = {};
		}
	}

	validate_serial_batch_item() {
		const doc = this.events.get_frm().doc;
		const item_row = doc.items.find(item => item.name === this.name);

		if (!item_row) return;

		const serialized = item_row.has_serial_no;
		const batched = item_row.has_batch_no;
		const no_serial_selected = !item_row.serial_no;
		const no_batch_selected = !item_row.batch_no;

		if ((serialized && no_serial_selected) || (batched && no_batch_selected) ||
			(serialized && batched && (no_batch_selected || no_serial_selected))) {

			frappe.show_alert({
				message: __("Item is removed since no serial / batch no selected."),
				indicator: 'orange'
			});
			frappe.utils.play_sound("cancel");
			return this.events.remove_item_from_cart();
		}
	}

	render_dom(item) {
		let { item_name, description, image, price_list_rate, item_code } = item;

		function get_description_html() {
			if (description) {
				description = description.indexOf('...') === -1 && description.length > 140 ? description.substr(0, 139) + '...' : description;
				return description;
			}
			return ``;
		}

		this.$item_name.html(item_name);
		this.$item_description.html(get_description_html());
		this.$item_code.html(item_code)
		// this.$item_price.html(format_currency(price_list_rate, this.currency));
		if (!this.hide_images && image) {
			this.$item_image.html(
				`<img
					onerror="cur_pos.item_details.handle_broken_image(this)"
					class="h-full" src="${image}"
					alt="${frappe.get_abbr(item_name)}"
					style="object-fit: cover;">`
			);
		} else {
			this.$item_image.html(`<div class="item-abbr">${frappe.get_abbr(item_name)}</div>`);
		}

	}

	handle_broken_image($img) {
		const item_abbr = $($img).attr('alt');
		$($img).replaceWith(`<div class="item-abbr">${item_abbr}</div>`);
	}

	render_discount_dom(item) {
		if (item.discount_percentage) {
			this.$dicount_section.html(
				`<div class="item-rate">${format_currency(item.price_list_rate, this.currency)}</div>
				<div class="item-discount">${item.discount_percentage}% off</div>`
			)
			// this.$item_price.html(format_currency(item.rate, this.currency));
		} else {
			this.$dicount_section.html(``)
		}
	}

	render_form(item) {
		// console.log("item : ",item);
		const me = this;
		const doc = this.events.get_frm().doc;
		const fields_to_display = this.get_form_fields(item);
		this.$form_container.html('');
		console.log("Fields To Display : ", fields_to_display);
		fields_to_display.forEach((fieldname, idx) => {
			this.$form_container.append(
				`<div class="${fieldname}-control" data-fieldname="${fieldname}"></div>`
			)

			const field_meta = this.item_meta.fields.find(df => df.fieldname === fieldname);
			// fieldname === 'discount_percentage' ? (field_meta.label = __('Discount (%)')) : '';

			this[`${fieldname}_control`] = frappe.ui.form.make_control({
				df: {
					...field_meta,
					onchange: function() {
						console.log("field_meta:", this.value)
						me.events.form_updated(me.current_item, fieldname, this.value);
					}
				},
				parent: this.$form_container.find(`.${fieldname}-control`),
				render_input: true,
			})
			this[`${fieldname}_control`].set_value(item[fieldname]);
		});


		this.make_auto_serial_selection_btn(item);

		this.bind_custom_control_change_event();
	}

	get_form_fields(item) {
		const fields = ['qty', 'uom', 'rate', 'conversion_factor'];
		if (item.has_serial_no) fields.push('serial_no');
		if (item.has_batch_no) fields.push('batch_no');
		return fields;
	}

	make_auto_serial_selection_btn(item) {
		if (item.has_serial_no) {
			if (!item.has_batch_no) {
				this.$form_container.append(
					`<div class="grid-filler no-select"></div>`
				);
			}
			const label = __('Auto Fetch Serial Numbers');
			this.$form_container.append(
				`<div class="btn btn-sm btn-secondary auto-fetch-btn">${label}</div>`
			);
			this.$form_container.find('.serial_no-control').find('textarea').css('height', '6rem');
		}
	}

	bind_custom_control_change_event() {
		const me = this;
		if (this.rate_control) {
			this.rate_control.df.onchange = function() {
				if (this.value || flt(this.value) === 0) {
					me.events.form_updated(me.current_item, 'rate', this.value).then(() => {
						const item_row = frappe.get_doc(me.doctype, me.name);
						const doc = me.events.get_frm().doc;
						// me.$item_price.html(format_currency(item_row.rate, doc.currency));
						// me.render_discount_dom(item_row);
					});
				}
			};
			this.rate_control.df.read_only = !this.allow_rate_change;
			this.rate_control.refresh();
		}

		if (this.discount_percentage_control && !this.allow_discount_change) {
			this.discount_percentage_control.df.read_only = 1;
			this.discount_percentage_control.refresh();
		}

		// if (this.warehouse_control) {
		// 	this.warehouse_control.df.reqd = 1;
		// 	this.warehouse_control.df.onchange = function() {
		// 		if (this.value) {
		// 			me.events.form_updated(me.current_item, 'warehouse', this.value).then(() => {
		// 			// console.log("----------------------------------", this.value);
		// 				me.item_stock_map = me.events.get_item_stock_map();
		// 				// const available_qty = me.item_stock_map[me.item_row.item_code][this.value][0];
		// 				// const is_stock_item = Boolean(me.item_stock_map[me.item_row.item_code][this.value][1])
		// 				// me.warehouse_control.set_value(this.value);
		// 				// if (available_qty === undefined) {
		// 				// 	me.events.get_available_stock(me.item_row.item_code, this.value).then(() => {
		// 				// 		// item stock map is updated now reset warehouse
		// 				// 		me.warehouse_control.set_value(this.value);
		// 				// 	})
		// 				// } else if (available_qty === 0 && is_stock_item) {
		// 				// 	me.warehouse_control.set_value('');
		// 				// 	const bold_item_code = me.item_row.item_code.bold();
		// 				// 	const bold_warehouse = this.value.bold();
		// 				// 	frappe.throw(
		// 				// 		__('Item Code: {0} is not available under warehouse {1}.', [bold_item_code, bold_warehouse])
		// 				// 	);
		// 				// }
		// 				// me.actual_qty_control.set_value(available_qty);
		// 			});
		// 		}
		// 	}
		// 	this.warehouse_control.df.get_query = () => {
		// 		return {
		// 			filters: { company: this.events.get_frm().doc.company }
		// 		}
		// 	};
		// 	this.warehouse_control.refresh();
		// 	// this.warehouse_control.set_value(this.value)
		// }

		if (this.serial_no_control) {
			this.serial_no_control.df.reqd = 1;
			this.serial_no_control.df.onchange = async function() {
				!me.current_item.batch_no && await me.auto_update_batch_no();
				me.events.form_updated(me.current_item, 'serial_no', this.value);
			}
			this.serial_no_control.refresh();
		}

		if (this.batch_no_control) {
			this.batch_no_control.df.reqd = 1;
			this.batch_no_control.df.get_query = () => {
				return {
					query: 'erpnext.controllers.queries.get_batch_no',
					filters: {
						item_code: me.item_row.item_code,
						warehouse: me.item_row.warehouse,
						posting_date: me.events.get_frm().doc.posting_date
					}
				}
			};
			this.batch_no_control.refresh();
		}

		if (this.uom_control) {
			this.uom_control.df.onchange = function() {
				me.events.form_updated(me.current_item, 'uom', this.value);

				const item_row = frappe.get_doc(me.doctype, me.name);
				me.conversion_factor_control.df.read_only = (item_row.stock_uom == this.value);
				me.conversion_factor_control.refresh();
			}
		}

		// frappe.model.on("POS Invoice Item", "*", (fieldname, value, item_row) => {
		// 	const field_control = this[`${fieldname}_control`];
		// 	const item_row_is_being_edited = this.compare_with_current_item(item_row);

		// 	if (item_row_is_being_edited && field_control && field_control.get_value() !== value) {
		// 		field_control.set_value(value);
		// 		cur_pos.update_cart_html(item_row);
		// 	}
		// });
	}

	async auto_update_batch_no() {
		if (this.serial_no_control && this.batch_no_control) {
			const selected_serial_nos = this.serial_no_control.get_value().split(`\n`).filter(s => s);
			if (!selected_serial_nos.length) return;

			// find batch nos of the selected serial no
			const serials_with_batch_no = await frappe.db.get_list("Serial No", {
				filters: { 'name': ["in", selected_serial_nos]},
				fields: ["batch_no", "name"]
			});
			const batch_serial_map = serials_with_batch_no.reduce((acc, r) => {
				if (!acc[r.batch_no]) {
					acc[r.batch_no] = [];
				}
				acc[r.batch_no] = [...acc[r.batch_no], r.name];
				return acc;
			}, {});
			// set current item's batch no and serial no
			const batch_no = Object.keys(batch_serial_map)[0];
			const batch_serial_nos = batch_serial_map[batch_no].join(`\n`);
			// eg. 10 selected serial no. -> 5 belongs to first batch other 5 belongs to second batch
			const serial_nos_belongs_to_other_batch = selected_serial_nos.length !== batch_serial_map[batch_no].length;

			const current_batch_no = this.batch_no_control.get_value();
			current_batch_no != batch_no && await this.batch_no_control.set_value(batch_no);

			if (serial_nos_belongs_to_other_batch) {
				this.serial_no_control.set_value(batch_serial_nos);
				this.qty_control.set_value(batch_serial_map[batch_no].length);

				delete batch_serial_map[batch_no];
				this.events.clone_new_batch_item_in_frm(batch_serial_map, this.current_item);
			}
		}
	}

	bind_events() {
		this.bind_auto_serial_fetch_event();
		this.bind_fields_to_numpad_fields();

		this.$component.on('click', '.close-btn', () => {
			this.events.close_item_details();
		});
	}

	attach_shortcuts() {
		this.wrapper.find('.close-btn').attr("title", "Esc");
		frappe.ui.keys.on("escape", () => {
			const item_details_visible = this.$component.is(":visible");
			if (item_details_visible) {
				this.events.close_item_details();
			}
		});
	}

	bind_fields_to_numpad_fields() {
		const me = this;
		this.$form_container.on('click', '.input-with-feedback', function() {
			const fieldname = $(this).attr('data-fieldname');
			if (this.last_field_focused != fieldname) {
				me.events.item_field_focused(fieldname);
				this.last_field_focused = fieldname;
			}
		});
	}

	bind_auto_serial_fetch_event() {
		this.$form_container.on('click', '.auto-fetch-btn', () => {
			this.batch_no_control && this.batch_no_control.set_value('');
			let qty = this.qty_control.get_value();
			let conversion_factor = this.conversion_factor_control.get_value();
			let expiry_date = this.item_row.has_batch_no ? this.events.get_frm().doc.posting_date : "";

			let numbers = frappe.call({
				method: "erpnext.stock.doctype.serial_no.serial_no.auto_fetch_serial_number",
				args: {
					qty: qty * conversion_factor,
					item_code: this.current_item.item_code,
					warehouse: this.warehouse_control.get_value() || '',
					batch_nos: this.current_item.batch_no || '',
					posting_date: expiry_date,
					for_doctype: 'POS Invoice'
				}
			});

			numbers.then((data) => {
				let auto_fetched_serial_numbers = data.message;
				let records_length = auto_fetched_serial_numbers.length;
				if (!records_length) {
					const warehouse = this.warehouse_control.get_value().bold();
					const item_code = this.current_item.item_code.bold();
					frappe.msgprint(
						__('Serial numbers unavailable for Item {0} under warehouse {1}. Please try changing warehouse.', [item_code, warehouse])
					);
				} else if (records_length < qty) {
					frappe.msgprint(
						__('Fetched only {0} available serial numbers.', [records_length])
					);
					this.qty_control.set_value(records_length);
				}
				numbers = auto_fetched_serial_numbers.join(`\n`);
				this.serial_no_control.set_value(numbers);
			});
		})
	}

	toggle_component(show) {
		show ? this.$component.css('display', 'flex') : this.$component.css('display', 'none');
	}
}

// ----------------------------------------------------------------------------------------------------------------------------------------------

class ItemSelector{
	// eslint-disable-next-line no-unused-vars
	constructor({ frm, wrapper,field_wrapper, events, settings }) {
		this.wrapper = wrapper;
		this.field_section = field_wrapper;
		this.events = events;
		this.hide_images = settings.hide_images;
		this.auto_add_item = settings.auto_add_item_to_cart;

		this.inti_component();
	}

	inti_component() {
		this.prepare_dom();
		this.make_fields_bar();
		this.make_search_bar();
		this.load_items_data();
		this.bind_events();
		// this.attach_shortcuts();
	}

	prepare_dom() {
		this.field_section.append(
			`
			<section class = "fields-section">
			<div class="field-label">${__('Fields')}</div>
			<div class="field-input-section">
				<div class="manager-field"></div>
				<div class="purpose-field"></div>
				<div class="required-field"></div>
				<div class="target-field"></div>
				<div class="source-field"></div>
			</div>
			</section>`
		)
		this.wrapper.append(
			`<section class="items-selector">
				<div class="filter-section">
					<div class="label">${__('All Items')}</div>
					<div class="search-field"></div>
					<div class="item-group-field"></div>
				</div>
				<div class="items-container"></div>
			</section>`
		);
		this.$fields_component = this.field_section.find('.fields-section')
		this.$component = this.wrapper.find('.items-selector');
		this.$items_container = this.$component.find('.items-container');
	}

	async load_items_data() {
		if (!this.item_group) {
			const res = await frappe.db.get_value("Item Group", {lft: 1, is_group: 1}, "name");
			this.parent_item_group = res.message.name;
		}
		// if (!this.price_list) {
		// 	const res = await frappe.db.get_value("POS Profile", this.pos_profile, "selling_price_list");
		// 	this.price_list = res.message.selling_price_list;
		// }

		this.get_items({}).then(({message}) => {
			console.log("load_items_data: ", message.items);
			this.render_item_list(message.items);
		});
	}

	get_items({start = 0, page_length = 40, search_term=''}) {
		const doc = this.events.get_frm().doc;
		let { item_group, pos_profile } = this;

		!item_group && (item_group = this.parent_item_group);

		return frappe.call({
			method: "dezy_custom.dezy_custom.page.material_request_cus.material_request_cus.get_items",
			freeze: true,
			args: { start, page_length, item_group, search_term },
		});
	}

	render_item_list(items) {
		this.$items_container.html('');

		items.forEach(item => {
			const item_html = this.get_item_html(item);
			this.$items_container.append(item_html);
		});
	}

	get_item_html(item) {
		const me = this;
		// eslint-disable-next-line no-unused-vars
		const { item_image, serial_no, batch_no, barcode, actual_qty, stock_uom, price_list_rate, warehouse } = item;
		const precision = flt(price_list_rate, 2) % 1 != 0 ? 2 : 0;
		let indicator_color;
		let qty_to_display = actual_qty;


		if (item.is_stock_item) {
			indicator_color = (actual_qty > 10 ? "green" : actual_qty <= 0 ? "red" : "orange");

			if (Math.round(qty_to_display) > 999) {
				qty_to_display = Math.round(qty_to_display)/1000;
				qty_to_display = qty_to_display.toFixed(1) + 'K';
			}
		} else {
			indicator_color = '';
			qty_to_display = '';
		}

		function get_item_image_html() {
			if (!me.hide_images && item_image) {
				return `
						<div class="flex items-center justify-center h-32 border-b-grey text-6xl text-grey-100">
							<img
								onerror="cur_pos.item_selector.handle_broken_image(this)"
								class="h-full item-img" src="${item_image}"
								alt="${frappe.get_abbr(item.item_name)}"
							>
						</div>`;
			} else {
				return `
						<div class="item-display abbr">${frappe.get_abbr(item.item_name)}</div>`;
			}
		}

		return (
			`<div class="item-wrapper"
				data-item-code="${escape(item.item_code)}" data-serial-no="${escape(serial_no)}"
				data-batch-no="${escape(batch_no)}" data-uom="${escape(stock_uom)}"
				data-rate="${escape(price_list_rate || 0)}" data-warehouse="${escape(item.warehouse)}"
				title="${item.item_name}">

				${get_item_image_html()}

				<div class="item-detail" style = "height:fit-content !important; padding:0.5rem;">
					<div class="item-name" style = "overflow:normal !important; white-space:normal !important;">
						${item.item_name}
					</div>
				</div>
			</div>`
		);
	}

	handle_broken_image($img) {
		const item_abbr = $($img).attr('alt');
		$($img).parent().replaceWith(`<div class="item-display abbr">${item_abbr}</div>`);
	}
	// make_material_request_fields() {
	// 	const me = this;
	// 	const doc = me.events.get_frm().doc
	// 	this.$component.find()
	// }
	make_fields_bar() {
		this.apply_responsive()
		const me = this;
		const doc = me.events.get_frm().doc
		this.$fields_component.find(".manager-field").html('')
		this.$fields_component.find(".purpose-field").html('')
		this.$fields_component.find(".required-field").html('')
		this.$fields_component.find(".target-field").html('')
		this.$fields_component.find(".source-field").html('')
		let is_source_warehouse = this.$fields_component.find('.source-field');
		this.manager_field = frappe.ui.form.make_control({
			df: {
				label: __('Manager'),
				fieldtype: 'Link',
				options: 'User',
				placeholder: __('Select Manager'),
				reqd:1,
				onchange: function () {
					if (this.value) {
						const frm = me.events.get_frm();
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, 'manager', this.value);
						// console.log(frm.doc);
					}
				}
			},
			parent: this.$fields_component.find('.manager-field'),
			render_input: true,
		});
		this.purpose_field = frappe.ui.form.make_control({
			df: {
				label: __('Purpose'),
				fieldtype: 'Select',
				options:[
					'Purchase',
					'Clinic Transfer',
				],
				placeholder: __('Default Purchase'),
				reqd:1,
				onchange: function () {
					console.log(this);
					if (this.value == "Clinic Transfer") {
					const frm = me.events.get_frm();
					is_source_warehouse["0"].hidden = false;
					console.log("if block",frm.doc.name);
					frappe.model.set_value(frm.doc.doctype, frm.doc.name, "material_request_type", "Material Transfer")
				}
				else if(this.value === 'Purchase'){
					const frm = me.events.get_frm();
					// const frm = me.events.get_frm().doc;
					console.log("else block :", frm);
					is_source_warehouse["0"].hidden = true;
					frappe.model.set_value(frm.doc.doctype, frm.doc.name, "material_request_type", this.value)
				}
				},
			},
			parent: this.$fields_component.find('.purpose-field'),
			render_input: true,
		});
		this.required_by = frappe.ui.form.make_control({
			df: {
				label: __('Required By'),
				fieldtype: 'Date',
				reqd:1,
				onchange: function () {
					const frm = me.events.get_frm()
					frappe.model.set_value(frm.doc.doctype, frm.doc.name, "schedule_date", this.value)
				}
			},
			parent: this.$fields_component.find('.required-field'),
			render_input: true,
		});
		this.target_warehouse = frappe.ui.form.make_control({
			df: {
				label: __('Select Clinic'),
				fieldtype: 'Link',
				options:'Warehouse',
				placeholder: __('Select Clinic'),
				reqd:1,
				onchange: function () {
					if (this.value) {
						const frm = me.events.get_frm()
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, "warehouse", this.value)
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, "set_warehouse", this.value)
					}
				},
				get_query: function () {
					const doc = me.events.get_frm().doc
					return {
						query: 'dezy_custom.dezy_custom.page.material_request_cus.material_request_cus.warehouse_query',
						filters: {
							company:doc.company
						}
					};
				},
			},
			parent: this.$fields_component.find('.target-field'),
			render_input: true,
		});

		this.source_warehouse = frappe.ui.form.make_control({
			df: {
				label: __('Source Warehouse'),
				fieldtype: 'Link',
				options:'Warehouse',
				placeholder: __('Source Warehouse'),
				onchange: function () {
					if (this.value) {
						const frm = me.events.get_frm()
						frappe.model.set_value(frm.doc.doctype, frm.doc.name, "set_from_warehouse", this.value)
					}
				},
				get_query: function () {
					const doc = me.events.get_frm().doc
					return {
						query: 'dezy_custom.dezy_custom.page.material_request_cus.material_request_cus.warehouse_query',
						filters: {
							company:doc.company
						}
					};
				},
			},
			parent: this.$fields_component.find('.source-field'),
			render_input: true,
		});
		// console.log("Source Warehouse",custom_field["0"]);
		is_source_warehouse["0"].hidden = true;
	}
	apply_responsive() {
		const field_input_section = this.$fields_component.find(".field-input-section");
		const label_field =this.$fields_component.find(".field-label");
		label_field.css({
			"text-align":"left",
			"font-weight":"bold",
			"font-size":"1rem",
			"padding":"0.5rem 0 0 1rem"
		})
		field_input_section.css({
			"display": "grid",
            "grid-template-columns": "repeat(4,  1fr)",
            "background-color": "white",
            "padding": "1rem",
            "align-items": "center",
            "grid-gap":"0.5rem",
		})
	}
	make_search_bar() {
		const me = this;
		const doc = me.events.get_frm().doc;
		this.$component.find('.search-field').html('');
		this.$component.find('.item-group-field').html('');

		this.search_field = frappe.ui.form.make_control({
			df: {
				label: __('Search'),
				fieldtype: 'Data',
				placeholder: __('Search by item code, serial number or barcode')
			},
			parent: this.$component.find('.search-field'),
			render_input: true,
		});
		this.item_group_field = frappe.ui.form.make_control({
			df: {
				label: __('Item Group'),
				fieldtype: 'Link',
				options: 'Item Group',
				placeholder: __('Select item group'),
				onchange: function() {
					me.item_group = this.value;
					!me.item_group && (me.item_group = me.parent_item_group);
					me.filter_items();
				},
				get_query: function () {
					return {
						query: 'erpnext.selling.page.point_of_sale.point_of_sale.item_group_query',
						filters: {
							pos_profile: doc ? doc.pos_profile : ''
						}
					};
				},
			},
			parent: this.$component.find('.item-group-field'),
			render_input: true,
		});
		this.search_field.toggle_label(false);
		this.item_group_field.toggle_label(false);

		this.attach_clear_btn();
	}

	attach_clear_btn() {
		this.search_field.$wrapper.find('.control-input').append(
			`<span class="link-btn" style="top: 2px;">
				<a class="btn-open no-decoration" title="${__("Clear")}">
					${frappe.utils.icon('close', 'sm')}
				</a>
			</span>`
		);

		this.$clear_search_btn = this.search_field.$wrapper.find('.link-btn');

		this.$clear_search_btn.on('click', 'a', () => {
			this.set_search_value('');
			this.search_field.set_focus();
		});
	}

	set_search_value(value) {
		$(this.search_field.$input[0]).val(value).trigger("input");
	}

	bind_events() {
		const me = this;
		// window.onScan = onScan;

		// onScan.decodeKeyEvent = function (oEvent) {
		// 	var iCode = this._getNormalizedKeyNum(oEvent);
		// 	switch (true) {
		// 		case iCode >= 48 && iCode <= 90: // numbers and letters
		// 		case iCode >= 106 && iCode <= 111: // operations on numeric keypad (+, -, etc.)
		// 		case (iCode >= 160 && iCode <= 164) || iCode == 170: // ^ ! # $ *
		// 		case iCode >= 186 && iCode <= 194: // (; = , - . / `)
		// 		case iCode >= 219 && iCode <= 222: // ([ \ ] ')
		// 		case iCode == 32: // spacebar
		// 			if (oEvent.key !== undefined && oEvent.key !== '') {
		// 				return oEvent.key;
		// 			}

		// 			var sDecoded = String.fromCharCode(iCode);
		// 			switch (oEvent.shiftKey) {
		// 				case false: sDecoded = sDecoded.toLowerCase(); break;
		// 				case true: sDecoded = sDecoded.toUpperCase(); break;
		// 			}
		// 			return sDecoded;
		// 		case iCode >= 96 && iCode <= 105: // numbers on numeric keypad
		// 			return 0 + (iCode - 96);
		// 	}
		// 	return '';
		// };

		// onScan.attachTo(document, {
		// 	onScan: (sScancode) => {
		// 		if (this.search_field && this.$component.is(':visible')) {
		// 			this.search_field.set_focus();
		// 			this.set_search_value(sScancode);
		// 			this.barcode_scanned = true;
		// 		}
		// 	}
		// });

		this.$component.on('click', '.item-wrapper', function() {
			const $item = $(this);
			console.log("on_click: ", $item);
			const item_code = unescape($item.attr('data-item-code'));
			let batch_no = unescape($item.attr('data-batch-no'));
			let serial_no = unescape($item.attr('data-serial-no'));
			let uom = unescape($item.attr('data-uom'));
			let rate = unescape($item.attr('data-rate'));
			const doc = me.events.get_frm().doc
			let warehouse = doc.warehouse
			// escape(undefined) returns "undefined" then unescape returns "undefined"
			batch_no = batch_no === "undefined" ? undefined : batch_no;
			serial_no = serial_no === "undefined" ? undefined : serial_no;
			uom = uom === "undefined" ? undefined : uom;
			rate = rate === "undefined" ? undefined : rate;

			me.events.item_selected({
				field: 'qty',
				value: "+1",
				item: { item_code, batch_no, serial_no, uom, rate, warehouse }
			});
			me.search_field.set_focus();
		});

		this.search_field.$input.on('input', (e) => {
			clearTimeout(this.last_search);
			this.last_search = setTimeout(() => {
				const search_term = e.target.value;
				this.filter_items({ search_term });
			}, 300);

			this.$clear_search_btn.toggle(
				Boolean(this.search_field.$input.val())
			);
		});

		this.search_field.$input.on('focus', () => {
			this.$clear_search_btn.toggle(
				Boolean(this.search_field.$input.val())
			);
		});
	}

	attach_shortcuts() {
		const ctrl_label = frappe.utils.is_mac() ? '⌘' : 'Ctrl';
		this.search_field.parent.attr("title", `${ctrl_label}+I`);
		frappe.ui.keys.add_shortcut({
			shortcut: "ctrl+i",
			action: () => this.search_field.set_focus(),
			condition: () => this.$component.is(':visible'),
			description: __("Focus on search input"),
			ignore_inputs: true,
			page: cur_page.page.page
		});
		this.item_group_field.parent.attr("title", `${ctrl_label}+G`);
		frappe.ui.keys.add_shortcut({
			shortcut: "ctrl+g",
			action: () => this.item_group_field.set_focus(),
			condition: () => this.$component.is(':visible'),
			description: __("Focus on Item Group filter"),
			ignore_inputs: true,
			page: cur_page.page.page
		});

		// for selecting the last filtered item on search
		frappe.ui.keys.on("enter", () => {
			const selector_is_visible = this.$component.is(':visible');
			if (!selector_is_visible || this.search_field.get_value() === "") return;

			if (this.items.length == 1) {
				this.$items_container.find(".item-wrapper").click();
				frappe.utils.play_sound("submit");
				this.set_search_value('');
			} else if (this.items.length == 0 && this.barcode_scanned) {
				// only show alert of barcode is scanned and enter is pressed
				frappe.show_alert({
					message: __("No items found. Scan barcode again."),
					indicator: 'orange'
				});
				frappe.utils.play_sound("error");
				this.barcode_scanned = false;
				this.set_search_value('');
			}
		});
	}

	filter_items({ search_term='' }={}) {
		if (search_term) {
			search_term = search_term.toLowerCase();

			// memoize
			this.search_index = this.search_index || {};
			if (this.search_index[search_term]) {
				const items = this.search_index[search_term];
				this.items = items;
				this.render_item_list(items);
				this.auto_add_item && this.items.length == 1 && this.add_filtered_item_to_cart();
				return;
			}
		}

		this.get_items({ search_term })
			.then(({ message }) => {
				// eslint-disable-next-line no-unused-vars
				const { items, serial_no, batch_no, barcode } = message;
				if (search_term && !barcode) {
					this.search_index[search_term] = items;
				}
				this.items = items;
				this.render_item_list(items);
				this.auto_add_item && this.items.length == 1 && this.add_filtered_item_to_cart();
			});
	}

	add_filtered_item_to_cart() {
		this.$items_container.find(".item-wrapper").click();
		this.set_search_value('');
	}

	resize_selector(minimize) {
		minimize ?
			this.$component.find('.filter-section').css('grid-template-columns', 'repeat(1, minmax(0, 1fr))') :
			this.$component.find('.filter-section').css('grid-template-columns', 'repeat(12, minmax(0, 1fr))');

		minimize ?
			this.$component.find('.search-field').css('margin', 'var(--margin-sm) 0px') :
			this.$component.find('.search-field').css('margin', '0px var(--margin-sm)');

		minimize ?
			this.$component.css('grid-column', 'span 2 / span 2') :
			this.$component.css('grid-column', 'span 6 / span 6');

		minimize ?
			this.$items_container.css('grid-template-columns', 'repeat(1, minmax(0, 1fr))') :
			this.$items_container.css('grid-template-columns', 'repeat(4, minmax(0, 1fr))');
	}

	toggle_component(show) {
		this.set_search_value('');
		this.$component.css('display', show ? 'flex': 'none');
	}
};

// -----------------------------------------------------------------------------------------------------------------------

class NumberPad {
	constructor({ wrapper, events, cols, keys, css_classes, fieldnames_map }) {
		this.wrapper = wrapper;
		this.events = events;
		this.cols = cols;
		this.keys = keys;
		this.css_classes = css_classes || [];
		this.fieldnames = fieldnames_map || {};

		this.init_component();
	}

	init_component() {
		this.prepare_dom();
		this.bind_events();
	}

	prepare_dom() {
		const { cols, keys, css_classes, fieldnames } = this;

		function get_keys() {
			return keys.reduce((a, row, i) => {
				return a + row.reduce((a2, number, j) => {
					const class_to_append = css_classes && css_classes[i] ? css_classes[i][j] : '';
					const fieldname = fieldnames && fieldnames[number] ?
						fieldnames[number] : typeof number === 'string' ? frappe.scrub(number) : number;

					return a2 + `<div class="numpad-btn ${class_to_append}" data-button-value="${fieldname}">${__(number)}</div>`;
				}, '');
			}, '');
		}

		this.wrapper.html(
			`<div class="numpad-container">
				${get_keys()}
			</div>`
		)
	}

	bind_events() {
		const me = this;
		this.wrapper.on('click', '.numpad-btn', function() {
			const $btn = $(this);
			me.events.numpad_event($btn);
		});
	}
}

