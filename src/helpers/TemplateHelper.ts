import type { ITemplate, ITemplateGroup } from '@/models';

export default class TemplateHelper {
  public static getTemplateFromRoute(): ITemplate | null {
    const queryParams = new URLSearchParams(window.location.search);
    const route = queryParams.get('route')?.toLowerCase();

    let template: ITemplate | null = null;
    TemplateHelper.get().forEach((group) => {
      group.templates.forEach((t: ITemplate) => {
        if (t.route?.toLowerCase() == route) template = t;
      });
    });

    return template;
  }

  public static templateGroups: ITemplateGroup[] = [];

  public static get(): ITemplateGroup[] {
    this.templateGroups[0].templates.sort((a, b) => a.name.localeCompare(b.name));
    return this.templateGroups;
  }
}
