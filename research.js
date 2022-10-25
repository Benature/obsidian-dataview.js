class Research {
  title(p) {
    // return p;
    let title = "";
    if (p.alias) {
      var alias;
      if (p.alias.constructor == String && p.alias.startsWith("@")) {
        alias = p.file.name;
      } else {
        alias = p.alias;
      }
      if (p.title.indexOf(alias) >= 0) {
        let t = `[[` + p.file.name + `|` + alias + `]]`;
        title = p.title.replace(alias, t);
      } else {
        title = `[[` + p.file.name + `|` + alias + `]] *|* ` + p.title;
      }
    } else {
      title = `[[` + p.file.name + `|` + p.title + `]]`;
    }
    let CCF = this.CCF(p);
    return `${CCF} ${title}`;
  }
  CCF(p) {
    const color = { A: "#e05252", B: "orange", C: "green" };
    const CCF_level_index = 2;

    const CCF_index = p.file.etags
      .map((t) => String(t).indexOf("CCF/") >= 0)
      .indexOf(true);
    let CCF = "";
    if (CCF_index >= 0) {
      CCF = String(p.file.etags[CCF_index]).split("/")[CCF_level_index];
      CCF = `<a style="color: ${color[CCF]}" href="#A/CCF/${CCF}">[${CCF}]</a>`;
    }
    return CCF;
  }
  year(y) {
    let maxY = 2022;
    let minY = 2015;
    let min_alpha = 0.4;
    let style = "";
    if (y <= minY) {
      style = `style="color: rgba(255,255,255,${
        min_alpha - 0.1
      }); font-style: italic;"`;
    } else {
      let alpha =
        (1 - (maxY - y) / (maxY - minY)) * (1 - min_alpha) + min_alpha;
      style = `style="color: rgba(255,255,255,${alpha});"`;
    }
    if (y >= 2000) {
      y -= 2000;
    } else {
      y -= 1900;
    }
    if (y < 10) {
      y = `0${y}`;
    }
    return `<span ${style}>${y}\'</span>`;
  }
  file_size(p) {
    let size = p.file.size / 1024;
    let style = "";
    if (size < 2) {
      style = `style="color:gray; font-style: italic;"`;
    }
    return `<span ${style}>${size.toFixed(1)}</span>`;
  }

  d2s(t) {
    var dateformat = "MM.DD";
    return window.moment(t.toString()).format(dateformat);
  }

  researcher(dv) {
    var papers = dv
      .pages(`"Reading-notes" and [[]]`)
      .sort((p) => p.year, "desc");

    dv.el("p", "");
    this.render_table(dv, papers);
  }

  topic(dv, query = "") {
    var papers = dv
      .pages(`"Reading-notes" and [[${query}]] and -#graph-ignore`)
      .sort((p) => p.file.mtime, "desc");
    this.render_table(dv, papers);
  }

  render_table(dv, papers) {
    dv.table(
      [`Paper`, "年", "Related", "Area", "KB", "M/C"],
      papers.map((p) => [
        this.title(p),
        this.year(p.year),
        p.related,
        p.area,
        this.file_size(p),
        this.d2s(p.file.mtime) + `\n` + this.d2s(p.file.ctime),
      ])
    );
  }
}
