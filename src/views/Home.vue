<template>
  <div class="flex mb-4">
    <div class="w-1/3 pt-6 h-12 p-3">
      <FullCalendar class="fullCalendar" ref="fullCalendar" :options="calendarOption" />
    </div>
    <div class="w-2/3 pt-6 px-6 h-12">
      <FullCalendar class="resourceView" ref="resourceView" :options="resourceView" />
    </div>

    <div v-if="appointmentModal" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-12xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
          <!--header-->
          <div class="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 class="text-3xl font-semibold">
              Modal Title
            </h3>
            <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" v-on:click="appointmentModal = !appointmentModal">
              <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                ×
              </span>
            </button>
          </div>
          <!--body-->
            <div class="p-6">
              <FormulateForm
                class="login-form"
                values="formValues"
                >
               <h2 class="form-title">Client Name</h2>
                  <FormulateInput
                    input-class="w-full px-3 py-2 border border-gray-400 border-box rounded leading-none focus:border-green-500 outline-none"
                  />
                  <FormulateInput
                    input-class="w-full px-3 py-2 border border-gray-400 border-box rounded leading-none focus:border-green-500 outline-none"
                    :options="{first: 'First', second: 'Second', third: 'Third', fourth: 'Fourth'}"
                    type="select"
                    placeholder="Choose appointment type"
                    label="Which of your children is your favorite?"
                  />
                <h2 class="form-title">Forms and Notes</h2>
                <FormulateInput
                  input-class="w-full px-3 py-2 border border-gray-400 border-box rounded leading-none focus:border-green-500 outline-none"
                  type="textarea"
                  placeholder="Private notes about appointment"
                  label="NOTES"
                  validation="required|max:50,length"
                  error-behavior="live"
                />
                <FormulateInput
                  type="date"
                  name="sample"
                  input-class="w-full px-3 py-2 border border-gray-400 border-box rounded leading-none focus:border-green-500 outline-none"
                  label="Date of Birth"
                  placeholder="mm/dd/yyy"
                  validation="required|after:1945-01-01"
                  min="2018-12-01"
                  max="2021-01-01"
                  error-behavior="live"
                />
                <FormulateInput
                  input-class="w-full px-3 py-2 border border-gray-400 border-box rounded leading-none focus:border-green-500 outline-none"
                  :options="{first: 'Uninsured', second: 'Private Health Cover', third: 'Worker\'s Compensation', fourth: 'Department of Veteran Affairs', fifth: 'Garrison Health', sixth: 'Motor Vehicle Accident Insurance'}"
                  type="select"
                  label="Health cover"
                />
                <FormulateInput
                  input-class="w-full px-3 py-2 border border-gray-400 border-box rounded leading-none focus:border-green-500 outline-none"
                  :options="{first: 'Cottesloe Practice', second: 'Virtual Consult'}"
                  type="select"
                  label="Location"
                />
                <FormulateInput
                  :options="{first: 'yes', second: 'no'}"
                  type="radio"
                  label="Do you require wheelchair access?"
                />
                <FormulateInput
                  :options="{first: 'yes', second: 'no'}"
                  type="radio"
                  label="Do you have a referral?"
                />
              </FormulateForm>
            </div>
          <!--footer-->
          <div class="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            <button class="text-red-500 bg-transparent border border-solid border-red-500 hover:bg-red-500 hover:text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded outline-none focus:outline-none mr-1 mb-1" type="button" style="transition: all .15s ease" v-on:click="appointmentModal = !appointmentModal">
              Close
            </button>
            <button class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1" type="button" style="transition: all .15s ease" v-on:click="appointmentModal = !appointmentModal">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="appointmentModal" class="opacity-25 fixed inset-0 z-40 bg-black"></div>
  </div>
</template>

<script>
import axios from 'axios'
import FullCalendar from '@fullcalendar/vue'
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import momentTZ from 'moment-timezone'

export default {
  name: 'Home',
  data () {
    return {
      formValues: {},
      timeZone: momentTZ.tz.names(),
      appointmentModal: false,
      resourceView: {
        selectable: true,
        plugins: [interactionPlugin, resourceTimeGridPlugin],
        initialView: 'resourceTimeGridDay',
        dateClick: (info) => {
          this.appointmentModal = !this.appointmentModal
        },
        resources: [],
        events: []
      },
      calendarOption: {
        navLinks: true,
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth',
        navLinkDayClick: (date, jsEvent) => {
          const calendarApi = this.$refs.resourceView.getApi()
          calendarApi.gotoDate(date)
        },
        eventRender: (info) => {
          console.log(info)
        }
      }
    }
  },
  components: {
    FullCalendar
  },
  methods: {
    fetchAppointments () {
      axios.get('http://127.0.0.1:8000/appointments')
        .then((response) => {
          response.data.slice(-20).forEach((value, index) => {
            var name = `${value.firstName} ${value.lastName}`
            this.resourceView.resources.push({ title: name, id: value.id })
            this.resourceView.events.push({ resourceId: value.id, title: value.type, start: '2020-08-19T10:30:00+00:00', end: '2020-08-19T12:30:00+00:00' })
          })
        })
        .catch((error) => {
          console.error(error)
        })
    }
  },
  mounted () {
    this.fetchAppointments()
  }
}
</script>

<style lang="scss">
.fullCalendar.fc {
  .fc-col-header-cell-cushion {
    display: inline-block;
    padding: 2px 2px;
  }
  .fc-daygrid-day-number {
    margin: auto;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    text-align: center;
  }
  td, th, table {
    border-style: none !important;
  }
  .vc-day-content {
    background-color: #DD6B20;
  }
  table td a {
    font-size: 14px;
  }
}

#calendar {
  max-width: 900px;
  margin: 0 auto;
}

//Styles added to show Horizontal Scroll Bar
.fc-view-container {
  width: auto;
}

.fc-view-container .fc-view {
  overflow-x: scroll;
}

.fc-view-container .fc-view > table {
  width: 2500px;
}

</style>
