<template>
<!--选择配送选择时间弹层-->
<cmodal 
    :show="isTimePickerShow"
    :title="title"
    :ok="ok"
    @ok="onClick"
    @cancel="onClick"
    class="time-picker"
    >
    <scroller :direction="'vertical'" slot="content">
        <div class="list show-g3pp-time">
            <!--<li class="time-title">
                <span class="item-name"><i class="time-icon"></i>时间段</span>
                <div class="item-con">
                    <ul class="item_list">
                        <li v-for="(time, index) in g3ppTimeSource" ><em>{{time.label}}</em></li>
                    </ul>
                </div>
            </li>-->
                <!--<span class="item-name"><em>{{time.label}}</em></span>-->
            <div v-for="item in source.g3ppDeliverTimeOptions">
                <p>111--{{item.label}}</p>
                <div v-for="item2 in item.fixDeliveryOptions">
                    <p>222--{{item2.dateStr}}</p>
                    <div v-for="item3 in item2.slots">
                        <p>333--{{item3.label}}</p>
                    </div>
                </div>
            </div>
            <!-- <radio  v-for="(time, index) in g3ppTimeSource"  :source="g3ppTimeSource" :index="index" @onClick="onRadioClick">
                <div class="icon-container" slot="post">
                    <i>
                        <img  v-if="time.selected == 'Y' "src="../../images/check_yes.png">
                        <img v-else src="../../images/check_no.png">
                    </i>
                </div>
            </radio>-->
                                                    
        </div>
    </scroller>
</cmodal>
</template>
<script>
    import Vue from 'vue'
    import {Scroller, CModal, ModalMixin, RadioItem, RadioMixin}
    export default Vue.extend({
        mixins: [ModalMixin, RadioMixin],
        components: {
            cmodal: CModal,
            scroller: Scroller,
            radio: RadioItem,
        }
    })
</script>
<style lang="less">
    
</style>