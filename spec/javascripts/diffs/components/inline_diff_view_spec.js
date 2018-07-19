import Vue from 'vue';
import InlineDiffView from '~/diffs/components/inline_diff_view.vue';
import store from '~/mr_notes/stores';
import { createComponentWithStore } from 'spec/helpers/vue_mount_component_helper';
import diffFileMockData from '../mock_data/diff_file';
import discussionsMockData from '../mock_data/diff_discussions';

describe('InlineDiffView', () => {
  let component;
  const getDiffFileMock = () => Object.assign({}, diffFileMockData);
  const getDiscussionsMockData = () => [Object.assign({}, discussionsMockData)];

  beforeEach(() => {
    const diffFile = getDiffFileMock();

    store.dispatch('diffs/setInlineDiffViewType');
    component = createComponentWithStore(Vue.extend(InlineDiffView), store, {
      diffFile,
      diffLines: diffFile.highlightedDiffLines,
    }).$mount();
  });

  describe('template', () => {
    it('should have rendered diff lines', () => {
      const el = component.$el;

      expect(el.querySelectorAll('tr.line_holder').length).toEqual(6);
      expect(el.querySelectorAll('tr.line_holder.new').length).toEqual(2);
      expect(el.querySelectorAll('tr.line_holder.match').length).toEqual(1);
      expect(el.textContent.indexOf('Bad dates') > -1).toEqual(true);
    });

    it('should render discussions', done => {
      const el = component.$el;
      component.$store.dispatch('setInitialNotes', getDiscussionsMockData());
      component.$store.commit('diffs/SET_DIFF_DATA', { diffFiles: [getDiffFileMock()] });

      Vue.nextTick(() => {
        expect(el.querySelectorAll('.notes_holder').length).toEqual(1);
        expect(el.querySelectorAll('.notes_holder .note-discussion li').length).toEqual(5);
        expect(el.innerText.indexOf('comment 5') > -1).toEqual(true);
        component.$store.dispatch('setInitialNotes', []);

        done();
      });
    });
  });
});